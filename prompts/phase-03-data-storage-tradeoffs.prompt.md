---
mode: agent
description: "Phase 3 — Data Storage Trade-offs: durability, write-ahead logging, indexing costs, and concurrent access"
tools:
  - read_file
  - run_in_terminal
  - create_file
  - replace_string_in_file
phase: 3
title: "Data Storage Trade-offs"
prerequisites: [1, 2]
concepts: ["durability-guarantees", "write-ahead-logging", "indexing-costs", "concurrent-access"]
production_relevance: "Every system stores data. The difference between 'works' and 'production-grade' is what happens to that data during failures."
estimated_time: "5-7 hours"
---

# Phase 3: Data Storage Trade-offs

## Phase Contract

By the end of this phase, the learner MUST be able to:
1. **Decide:** Given a durability requirement ("never lose acknowledged writes" vs "occasional loss is acceptable"), choose the appropriate flush strategy and explain the throughput cost
2. **Predict:** What data survives a crash at any given moment — based on WAL configuration and flush intervals
3. **Build:** A key-value store with write-ahead log, crash recovery, and basic indexing — from scratch
4. **Debug:** After an intentional crash, determine which writes were lost, which survived, and explain WHY based on the WAL state

## Motivation Hook

> **Invoke:** `production-war-story` (phase=3)
>
> Story: The Acknowledged-But-Lost Writes
> Fintech startup returned "payment confirmed" before flushing to disk.
> Kernel panic lost 47 transactions. 72-hour manual reconciliation with bank.

## Concept Sequence

### Concept A: Durability as a Spectrum
> **Invoke:** `concept-deep-dive` (phase=3, concept="durability-guarantees")

Key mechanisms:
- What "acknowledged" means at each layer (application, OS buffer, disk controller, platter)
- fsync semantics: when data is ACTUALLY safe
- The durability-throughput trade-off: fsync per write vs. batched flush
- Battery-backed write caches: the hardware hack that changes the equation

### Concept B: Write-Ahead Logging
> **Invoke:** `concept-deep-dive` (phase=3, concept="write-ahead-logging")

Key mechanisms:
- WAL as an intent record: write the plan before executing it
- Recovery: replay uncommitted entries after crash
- Checkpointing: compacting the WAL when it gets too large
- WAL vs. copy-on-write: two approaches to crash safety

### Concept C: Indexing — The Read/Write Trade-off
> **Invoke:** `concept-deep-dive` (phase=3, concept="indexing-costs")

Key mechanisms:
- Sequential scan: O(n) reads, O(1) writes
- Hash index: O(1) reads, O(1) writes, no range queries
- B-tree: O(log n) reads, O(log n) writes, range-friendly
- Write amplification: every index makes writes more expensive
- "You're not optimizing reads — you're paying for them upfront during writes"

### Decision Point
> **Invoke:** `tradeoff-matrix` (decision="fsync-per-write vs batched-flush with WAL")

## Build Specification

> **Invoke:** `prototype-spec` (phase=3)

**Summary:** Build a key-value store from scratch that writes to files, implements WAL for crash safety, supports concurrent readers/writers, and has a basic index.

**Key constraints:**
- Must not lose data that was acknowledged to the client
- Must recover correctly after kill -9
- Must support concurrent access from Phase 2's multiple instances

## Implementation Path

> **Invoke:** `implementation-stepper` (phase=3)

Steps:
1. Simple file-backed key-value store (append-only log)
2. Add write-ahead log: log entry BEFORE data modification
3. Add crash recovery: on startup, replay any uncommitted WAL entries
4. Add concurrent reader/writer support (file locking or serialization)
5. Add hash index: in-memory map of key → file offset
6. Measure: read latency with vs. without index under 10K entries
7. Durability test: write → kill -9 → restart → verify all acknowledged writes survived

## Failure Lab

> **Invoke:** `failure-lab` (phase=3)

- **Scenario A:** Kill process mid-write WITHOUT WAL — observe data loss/corruption
- **Scenario B:** Kill process mid-write WITH WAL — observe correct recovery
- **Scenario C:** Concurrent writers + crash — observe which writes survive and ordering

## Gate Check Criteria

**Scenario question domain:** "Your team's database is too slow for the write-heavy workload. Someone suggests removing fsync to improve throughput. What's your response?"

**Key markers:**
- Articulates exactly what durability is lost (buffered data at risk during crash)
- Can quantify the risk: "You lose up to N seconds of writes"
- Proposes alternatives: batched flush, group commit, hardware solutions
- References their crash-recovery experiment

**Common misconceptions to probe:**
- "The OS will flush eventually" (wrong: not guaranteed before crash)
- "SSD makes fsync free" (wrong: still has latency, and write amplification)
- "More indexes = faster database" (wrong: write amplification kills throughput)

**Connection to next phase:** "Your store is durable and indexed. But every read hits disk. Phase 4: what if we kept frequently-accessed data in memory? (Spoiler: invalidation is where dreams go to die.)"

## Weakness Reinforcement Points

- Phase 5: when processing messages, revisit "acknowledged but not processed" vs "processed but not acknowledged"
- Phase 6: when replicating, revisit "what exactly gets replicated — the WAL or the data?"
