---
mode: agent
description: "Phase 6 — Replication and Consistency: replication topologies, consistency models, lag, and conflict resolution"
tools:
  - read_file
  - run_in_terminal
  - create_file
  - replace_string_in_file
phase: 6
title: "Replication and Consistency"
prerequisites: [1, 2, 3, 4, 5]
concepts: ["replication-topologies", "consistency-models", "replication-lag", "conflict-resolution"]
production_relevance: "Every database that claims 'high availability' is doing replication. Understanding lag and conflicts prevents the bugs that corrupt your data permanently."
estimated_time: "6-8 hours"
---

# Phase 6: Replication and Consistency

## Phase Contract

By the end of this phase, the learner MUST be able to:
1. **Decide:** Given a consistency requirement (strong, eventual, read-your-writes), choose a replication topology and explain the availability cost
2. **Predict:** What a user sees when reading from a replica that's 5 seconds behind the leader — and whether that's acceptable for a given use case
3. **Build:** A leader-follower data store where writes go to leader, reads can go to follower, and replication lag is visible
4. **Debug:** Given "my updates disappeared" user reports, distinguish between replication lag, lost writes, and split-brain conflicts

## Motivation Hook

> **Invoke:** `production-war-story` (phase=6)
>
> Story: The Replication Lag Surprise — users saw old profile data after updating. Support tickets: "your site is deleting my changes."

## Concept Sequence

### Concept A: Replication Topologies
> **Invoke:** `concept-deep-dive` (phase=6, concept="replication-topologies")

Key: leader-follower, multi-leader, leaderless. Operational reality of each.

### Concept B: Consistency Models as User-Visible Phenomena
> **Invoke:** `concept-deep-dive` (phase=6, concept="consistency-models")

Key: strong, eventual, causal, read-your-writes. What USERS experience under each.

### Concept C: Conflict Resolution
> **Invoke:** `concept-deep-dive` (phase=6, concept="conflict-resolution")

Key: last-write-wins, vector clocks, CRDTs, application-level merge.

### Decision Point
> **Invoke:** `tradeoff-matrix` (decision="synchronous replication vs asynchronous replication")

## Build Specification
> **Invoke:** `prototype-spec` (phase=6)

## Implementation Path
> **Invoke:** `implementation-stepper` (phase=6)

## Failure Lab
> **Invoke:** `failure-lab` (phase=6)

- **Scenario A:** Kill leader — observe follower behavior (does it serve stale reads? does it accept writes?)
- **Scenario B:** Introduce artificial 5-second replication lag — read from follower, observe staleness
- **Scenario C:** Network partition — leader and follower diverge, writes go to both sides, heal partition and observe conflicts

## Gate Check Criteria

**Scenario question domain:** "You're designing a user profile service. Writes happen rarely (profile updates). Reads are constant (every page load). Should reads go to replicas?"

**Key markers:**
- "It depends on what the user expects to see after they update"
- Read-your-writes consistency for the updating user, eventual for everyone else
- Understands that "stale by 2 seconds" is usually fine for other users but NOT for the writer
- References their lag observation experiment

**Connection to next phase:** "Replication gives you copies for availability. But one machine still holds ALL the data. What happens when the data outgrows one machine? Phase 7: splitting data across multiple machines — and the routing problem that creates."
