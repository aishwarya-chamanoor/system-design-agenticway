---
mode: agent
description: "Phase 7 — Partitioning and Sharding: partition strategies, hot partitions, rebalancing, and cross-partition queries"
tools:
  - read_file
  - run_in_terminal
  - create_file
  - replace_string_in_file
phase: 7
title: "Partitioning and Sharding"
prerequisites: [1, 2, 3, 4, 5, 6]
concepts: ["partition-strategies", "hot-partitions", "rebalancing", "cross-partition-queries"]
production_relevance: "When data outgrows one machine, you shard. The partitioning strategy you choose determines your system's failure mode for the next 3 years."
estimated_time: "5-7 hours"
---

# Phase 7: Partitioning and Sharding

## Phase Contract

By the end of this phase, the learner MUST be able to:
1. **Decide:** Given a data access pattern, choose between hash and range partitioning — and predict which type of query becomes expensive with each
2. **Predict:** Given a partition key and a celebrity/power-law workload, identify which shard will become hot and quantify the imbalance
3. **Build:** Phase 6's replicated store sharded across 3+ nodes with a routing layer and the ability to add a new shard without downtime
4. **Debug:** Given "service degraded for some users but not others," determine which shard is overloaded and what access pattern caused it

## Motivation Hook

> **Invoke:** `production-war-story` (phase=7)
>
> Story: The Celebrity Hot Partition — one user's 50M followers melted one shard while others sat idle.

## Concept Sequence

### Concept A: Partition Strategies
> **Invoke:** `concept-deep-dive` (phase=7, concept="partition-strategies")

### Concept B: Hot Partitions and Skew
> **Invoke:** `concept-deep-dive` (phase=7, concept="hot-partitions")

### Concept C: Rebalancing — The Operation That Kills Systems
> **Invoke:** `concept-deep-dive` (phase=7, concept="rebalancing")

### Decision Point
> **Invoke:** `tradeoff-matrix` (decision="hash-based vs range-based partitioning")

## Build Specification
> **Invoke:** `prototype-spec` (phase=7)

## Implementation Path
> **Invoke:** `implementation-stepper` (phase=7)

## Failure Lab
> **Invoke:** `failure-lab` (phase=7)

- **Scenario A:** Send 80% of traffic to one shard (hot key simulation)
- **Scenario B:** Kill one shard entirely — observe routing errors for that partition's data
- **Scenario C:** Add a new shard under load — rebalance data without dropping requests

## Gate Check Criteria

**Scenario question domain:** "Your user table has 500M rows and is growing. You need to shard it. The app does both 'get user by ID' and 'list users by country.' What's your partition key?"

**Key markers:**
- Recognizes the tension: hash(user_id) is great for point lookups but kills country queries
- Proposes secondary indexing or denormalization for the cross-partition case
- Acknowledges the rebalancing cost and proposes a strategy (consistent hashing, virtual partitions)
- References their hot-partition experiment

**Connection to next phase:** "You've distributed data across machines. But now: who decides which machine is the 'leader' for a partition? What happens when that leader dies? Phase 8: agreeing on things in a distributed system — the hardest problem in computing."
