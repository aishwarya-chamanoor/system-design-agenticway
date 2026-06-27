---
mode: agent
description: "Phase 8 — Coordination and Consensus: distributed consensus, leader election, distributed locks, and split-brain prevention"
tools:
  - read_file
  - run_in_terminal
  - create_file
  - replace_string_in_file
phase: 8
title: "Coordination and Consensus"
prerequisites: [1, 2, 3, 4, 5, 6, 7]
concepts: ["distributed-consensus", "leader-election", "distributed-locks", "split-brain"]
production_relevance: "Every distributed system that needs to agree on ANYTHING — who's the leader, is this lock held, what's the current config — needs consensus. Getting it wrong causes data corruption."
estimated_time: "6-8 hours"
---

# Phase 8: Coordination and Consensus

## Phase Contract

By the end of this phase, the learner MUST be able to:
1. **Decide:** When a system actually NEEDS consensus (expensive) vs. when eventual consistency is sufficient (cheap) — and articulate the cost of getting this wrong in both directions
2. **Predict:** In a 3-node cluster with a network partition (2 vs 1), which side can continue accepting writes and why the other MUST NOT
3. **Build:** A 3-node leader election protocol with a distributed lock service that prevents split-brain
4. **Debug:** Given two nodes both claiming to be leader, identify the root cause and implement fencing to prevent data corruption

## Motivation Hook

> **Invoke:** `production-war-story` (phase=8)
>
> Story: The Split-Brain Incident — both sides elected a leader, both accepted writes for 6 hours. Manual reconciliation of conflicting data. Some unrecoverable.

## Concept Sequence

### Concept A: Why Consensus is Expensive (and When You Need It)
> **Invoke:** `concept-deep-dive` (phase=8, concept="distributed-consensus")

### Concept B: Leader Election Mechanics
> **Invoke:** `concept-deep-dive` (phase=8, concept="leader-election")

### Concept C: Distributed Locks and Fencing Tokens
> **Invoke:** `concept-deep-dive` (phase=8, concept="distributed-locks")

### Decision Point
> **Invoke:** `tradeoff-matrix` (decision="consensus-based coordination vs eventual-consistency with conflict resolution")

## Build Specification
> **Invoke:** `prototype-spec` (phase=8)

## Implementation Path
> **Invoke:** `implementation-stepper` (phase=8)

## Failure Lab
> **Invoke:** `failure-lab` (phase=8)

- **Scenario A:** Kill one node in 3-node cluster — system should survive
- **Scenario B:** Partition: 2 nodes vs 1 — minority must step down
- **Scenario C:** Symmetric partition (each node isolated) — observe split-brain and implement fencing

## Gate Check Criteria

**Scenario question domain:** "Your team uses a distributed lock for ensuring only one worker processes each payment. The lock service had a 30-second network blip. What happened to payments during that time?"

**Key markers:**
- Understands lock expiry vs network partition distinction
- Mentions fencing tokens to prevent stale lock holders from writing
- Can articulate why "just increase the timeout" doesn't solve the fundamental problem
- References their split-brain experiment observations

**Connection to next phase:** "You can coordinate distributed components. Now: what if your system isn't one service but many? Phase 9: when a 'transaction' spans multiple services — and you can't use a database transaction."
