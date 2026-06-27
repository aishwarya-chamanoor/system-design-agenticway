---
mode: agent
description: "Phase 12 — Capacity Planning and Evolution: envelope estimation, bottleneck identification, migration strategies, and evolutionary architecture"
tools:
  - read_file
  - run_in_terminal
  - create_file
  - replace_string_in_file
phase: 12
title: "Capacity Planning and Evolution"
prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
concepts: ["envelope-estimation", "bottleneck-identification", "migration-strategies", "evolutionary-architecture"]
production_relevance: "The final skill: predicting where your system breaks next and planning the migration path to fix it — without stopping the train."
estimated_time: "5-7 hours"
---

# Phase 12: Capacity Planning and Evolution

## Phase Contract

By the end of this phase, the learner MUST be able to:
1. **Decide:** Given growth projections, determine which component breaks first and whether to scale it, replace it, or re-architect around it
2. **Predict:** Using back-of-envelope estimation, calculate the capacity ceiling of a system within 2x accuracy — and identify the limiting resource
3. **Build:** A capacity model for the full system built across phases 1-11, validate it with a 10x load test, and propose the migration plan
4. **Debug:** When a capacity estimate is wrong (reality doesn't match prediction), identify which assumption failed and adjust the model

## Motivation Hook

> **Invoke:** `production-war-story` (phase=12)
>
> Story: The Growth That Broke Everything — 8x traffic in 3 weeks. Database connection pool (not CPU, not memory) was the ceiling. One config change would have bought 3 months.

## Concept Sequence

### Concept A: Back-of-Envelope Estimation
> **Invoke:** `concept-deep-dive` (phase=12, concept="envelope-estimation")

Key: not interview tricks — actual capacity planning tools. Orders of magnitude. Latency numbers. Storage growth. Connection math.

### Concept B: Bottleneck Identification
> **Invoke:** `concept-deep-dive` (phase=12, concept="bottleneck-identification")

Key: Amdahl's law in practice. The "first thing that breaks" game. Profiling at the system level (not code level).

### Concept C: Migration Strategies
> **Invoke:** `concept-deep-dive` (phase=12, concept="migration-strategies")

Key: strangler fig, dual-writes, shadow traffic, blue-green, canary. How to change a running system.

### Decision Point
> **Invoke:** `tradeoff-matrix` (decision="build for current load (YAGNI) vs build for projected 10x load")

## Build Specification
> **Invoke:** `prototype-spec` (phase=12)

## Implementation Path
> **Invoke:** `implementation-stepper` (phase=12)

## Failure Lab
> **Invoke:** `failure-lab` (phase=12)

- **Scenario A:** 10x traffic spike — validate or disprove capacity estimate
- **Scenario B:** Gradual resource leak under sustained load — find the slow degradation
- **Scenario C:** Cascading failure from the weakest component at high load

## Gate Check Criteria

**Scenario question domain:** "Your system serves 10K RPS today. Product tells you they expect 100K RPS in 6 months due to a partnership deal. Walk me through your capacity planning process."

**Key markers:**
- Starts with measurement (what's current utilization of each component)
- Identifies the first bottleneck with math (not guessing)
- Proposes staged approach (don't build for 100K immediately — build for 30K first, validate)
- Migration strategy that doesn't require downtime
- Cost awareness (building for 10x is expensive — validate the projection first)
- References their 10x load test results

**Connection to completion:** "You've built, broken, and evolved a distributed system from one machine to a multi-service architecture. You can now make defensible decisions about any production system you encounter. The roadmap is complete — but the learning never stops."

## Graduation Criteria

The learner has completed the full roadmap when they can:
- [ ] Look at any production architecture diagram and identify the first three things that would break at 10x scale
- [ ] Propose a migration path for any identified bottleneck without requiring downtime
- [ ] Articulate trade-offs for any design decision they or others have made
- [ ] Design a system from scratch that is observable, resilient, and evolvable
- [ ] Explain any concept in this roadmap to a junior engineer in 3 sentences
