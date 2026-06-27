---
mode: agent
description: "Phase 4 — Caching and Invalidation: cache consistency, invalidation strategies, stampede prevention, and hot keys"
tools:
  - read_file
  - run_in_terminal
  - create_file
  - replace_string_in_file
phase: 4
title: "Caching and Invalidation"
prerequisites: [1, 2, 3]
concepts: ["cache-consistency", "invalidation-strategies", "stampede-prevention", "hot-keys"]
production_relevance: "Caching is the most common performance optimization — and the most common source of consistency bugs in production."
estimated_time: "4-6 hours"
---

# Phase 4: Caching and Invalidation

## Phase Contract

By the end of this phase, the learner MUST be able to:
1. **Decide:** Given a read/write ratio and consistency requirement, choose between TTL-based and event-driven invalidation — and explain what staleness the user will see
2. **Predict:** What happens to database load when the cache restarts cold under production traffic (and how to prevent it)
3. **Build:** A caching layer in front of Phase 3's store with two invalidation strategies and stampede protection
4. **Debug:** Given stale data reports, determine whether the issue is cache invalidation timing, race condition, or replication lag (Phase 6 preview)

## Motivation Hook

> **Invoke:** `production-war-story` (phase=4)
>
> Story: The Cache That Ate The Database — simultaneous TTL expiry took down a content platform for 45 minutes.

## Concept Sequence

### Concept A: Cache as a Consistency Liability
> **Invoke:** `concept-deep-dive` (phase=4, concept="cache-consistency")

### Concept B: Invalidation Strategies and Their Failure Modes
> **Invoke:** `concept-deep-dive` (phase=4, concept="invalidation-strategies")

### Decision Point
> **Invoke:** `tradeoff-matrix` (decision="TTL-based invalidation vs event-driven invalidation")

## Build Specification
> **Invoke:** `prototype-spec` (phase=4)

## Implementation Path
> **Invoke:** `implementation-stepper` (phase=4)

## Failure Lab
> **Invoke:** `failure-lab` (phase=4)

- **Scenario A:** Cold cache stampede — restart cache, all reads hit database
- **Scenario B:** Stale read window — update source, measure staleness duration
- **Scenario C:** Hot key + TTL expiry — single key causes thundering herd

## Gate Check Criteria

**Scenario question domain:** "You're launching a feature that will be read-heavy (100:1 read:write). How do you cache it? A product manager asks 'will users always see the latest data?'"

**Key markers:**
- Defines acceptable staleness window (doesn't promise "instant")
- Describes invalidation strategy with specific trade-offs
- Mentions stampede protection mechanism
- References their cold-cache experiment

**Connection to next phase:** "Your cache handles reads. But what about writes that take time? Phase 5: when processing is too slow to do synchronously, how do you handle work that takes longer than a request timeout?"
