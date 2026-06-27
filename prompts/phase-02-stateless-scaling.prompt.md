---
mode: agent
description: "Phase 2 — Stateless Horizontal Scaling: shared-nothing architecture, load distribution, and state externalization"
tools:
  - read_file
  - run_in_terminal
  - create_file
  - replace_string_in_file
phase: 2
title: "Stateless Horizontal Scaling"
prerequisites: [1]
concepts: ["statelessness", "shared-nothing-architecture", "load-distribution"]
production_relevance: "The first scaling decision every growing service faces: how to run multiple copies without breaking state."
estimated_time: "4-6 hours"
---

# Phase 2: Stateless Horizontal Scaling

## Phase Contract

By the end of this phase, the learner MUST be able to:
1. **Decide:** Given a stateful service, identify what state must be extracted and where to put it — and justify the trade-off of the chosen external store
2. **Predict:** What happens to in-flight requests when one instance dies, and how different routing strategies affect recovery
3. **Build:** Multiple instances of a service behind a load distribution layer, with fully externalized state
4. **Debug:** Using request tracing, determine why one instance is receiving disproportionate load and diagnose session affinity bugs

## Motivation Hook

> **Invoke:** `production-war-story` (phase=2)
>
> Story: The Stateful "Stateless" Service
> Shopping carts stored in local memory. Scaled to 4 instances.
> Customers lost cart items randomly depending on which instance served them.

## Concept Sequence

### Concept A: What "Stateless" Actually Requires
> **Invoke:** `concept-deep-dive` (phase=2, concept="statelessness")

Key mechanisms:
- The hidden statefulness trap: local caches, in-memory sessions, file uploads
- Shared-nothing architecture: what it means operationally
- Session affinity: the crutch that prevents real statelessness (and why it breaks)
- The external state store: what you've moved to (not eliminated)

### Concept B: Load Distribution Strategies
> **Invoke:** `concept-deep-dive` (phase=2, concept="load-distribution")

Key mechanisms:
- Round-robin: simple, assumes homogeneous instances
- Least-connections: adapts to instance capacity differences
- Consistent hashing: stable routing for caching layers
- Health checking: what "healthy" means (liveness vs. readiness)

### Decision Point
> **Invoke:** `tradeoff-matrix` (decision="session-affinity vs shared-nothing with external store")

## Build Specification

> **Invoke:** `prototype-spec` (phase=2)

**Summary:** Take Phase 1's service, extract all state to an external store, run 2-3 instances behind a load router. Observe routing behavior and instance failure handling.

**Key constraint:** Instances must be fully interchangeable — kill any one, and the system continues with zero data loss.

## Implementation Path

> **Invoke:** `implementation-stepper` (phase=2)

Steps:
1. Extract state from Phase 1 service into an external key-value store (file-based or simple network store)
2. Run a second instance of the service pointing to same external store
3. Build a request router (TCP/HTTP proxy) with round-robin distribution
4. Add request tracing: log which instance handles which request
5. Add instance health checking (heartbeat → remove unhealthy instance from rotation)
6. Load test with traffic, observe distribution across instances

## Failure Lab

> **Invoke:** `failure-lab` (phase=2)

- **Scenario A:** Kill one instance mid-request — observe connection drop and client retry behavior
- **Scenario B:** Make one instance slow (add 5s sleep) — observe load imbalance accumulation
- **Scenario C:** Restart all instances simultaneously — observe thundering herd on the state store

## Gate Check Criteria

**Scenario question domain:** "Your team is deploying a new version of a stateless API serving 10K RPS. How do you do it without dropping requests?"

**Key markers:**
- Understands rolling deploy (don't kill all instances at once)
- Mentions connection draining / graceful shutdown
- Considers the external state store as a potential bottleneck
- References their experience with instance kill from failure lab

**Common misconceptions to probe:**
- "Stateless means no state" (wrong: state is externalized, not eliminated)
- "More instances = linearly more capacity" (wrong: state store becomes bottleneck)
- "Load balancer handles everything" (wrong: learner must understand routing failures)

**Connection to next phase:** "You externalized state to avoid losing it. But that external store — how does IT handle concurrent access from all your instances? What happens when IT fails? That's Phase 3."

## Weakness Reinforcement Points

- Phase 7: when sharding, revisit "routing to the right place" and consistent hashing
- Phase 11: when adding circuit breakers, revisit health checking patterns
