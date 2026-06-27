---
mode: agent
description: "Phase 9 — Service Decomposition: service boundaries, synchronous coupling, saga pattern, and compensating transactions"
tools:
  - read_file
  - run_in_terminal
  - create_file
  - replace_string_in_file
phase: 9
title: "Service Decomposition and Communication Patterns"
prerequisites: [1, 2, 3, 4, 5, 6, 7, 8]
concepts: ["service-boundaries", "synchronous-coupling", "saga-pattern", "compensating-transactions"]
production_relevance: "Every growing system eventually decomposes into services. The communication pattern between them determines your blast radius and recovery story."
estimated_time: "6-8 hours"
---

# Phase 9: Service Decomposition and Communication Patterns

## Phase Contract

By the end of this phase, the learner MUST be able to:
1. **Decide:** Where to draw service boundaries based on data ownership — and explain why "one service per entity" is often wrong
2. **Predict:** What intermediate states users can observe during a multi-service saga — and whether that's acceptable
3. **Build:** A 3-service saga (order→inventory→payment) with compensating transactions that handle partial failure
4. **Debug:** Given a "user was charged but has no order" complaint, trace the saga state and determine which step failed and whether compensation executed

## Motivation Hook

> **Invoke:** `production-war-story` (phase=9)
>
> Story: The Saga That Couldn't Compensate — shipping service failed, refund API was also down. Customer charged with no order for 3 days.

## Concept Sequence

### Concept A: Service Boundaries as Data Ownership Boundaries
> **Invoke:** `concept-deep-dive` (phase=9, concept="service-boundaries")

### Concept B: Synchronous Calls as Hidden Coupling
> **Invoke:** `concept-deep-dive` (phase=9, concept="synchronous-coupling")

### Concept C: The Saga Pattern
> **Invoke:** `concept-deep-dive` (phase=9, concept="saga-pattern")

### Decision Point
> **Invoke:** `tradeoff-matrix` (decision="orchestration vs choreography vs two-phase-commit")

## Build Specification
> **Invoke:** `prototype-spec` (phase=9)

## Implementation Path
> **Invoke:** `implementation-stepper` (phase=9)

## Failure Lab
> **Invoke:** `failure-lab` (phase=9)

- **Scenario A:** Fail step 3 after steps 1-2 succeed — observe compensation execution
- **Scenario B:** Make service 2 slow (not dead) — observe timeout cascading
- **Scenario C:** Compensation itself fails — observe stuck state and manual intervention need

## Gate Check Criteria

**Scenario question domain:** "You're breaking a monolithic e-commerce app into services. The checkout flow currently uses a single database transaction. How do you handle the split?"

**Key markers:**
- Acknowledges loss of ACID across services
- Proposes saga with specific compensation actions
- Discusses user experience during intermediate states (pending, processing)
- Considers the "compensation also fails" case
- References their partial-failure experiment

**Connection to next phase:** "You have multiple services. But how do you know if they're healthy? When one is slow, how do you find it? Phase 10: seeing inside your distributed system."
