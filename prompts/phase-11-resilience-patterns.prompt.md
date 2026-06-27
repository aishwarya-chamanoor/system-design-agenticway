---
mode: agent
description: "Phase 11 — Resilience Patterns: circuit breakers, bulkheads, retry-with-jitter, graceful degradation, and timeout design"
tools:
  - read_file
  - run_in_terminal
  - create_file
  - replace_string_in_file
phase: 11
title: "Resilience Patterns Under Failure"
prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
concepts: ["circuit-breakers", "bulkheads", "retry-with-jitter", "graceful-degradation", "timeout-design"]
production_relevance: "Systems don't fail all at once. They degrade. Resilience patterns determine whether degradation is graceful or catastrophic."
estimated_time: "5-7 hours"
---

# Phase 11: Resilience Patterns Under Failure

## Phase Contract

By the end of this phase, the learner MUST be able to:
1. **Decide:** For a given dependency, choose the appropriate resilience pattern (circuit breaker, bulkhead, retry, timeout) — and explain why the WRONG pattern makes things worse
2. **Predict:** Given a circuit breaker configuration, predict what happens when the dependency recovers (immediate vs. half-open vs. thundering herd)
3. **Build:** Circuit breakers, retry-with-jitter, and graceful degradation paths in Phase 9's multi-service system
4. **Debug:** Given a cascading failure (all services timing out), identify whether the root cause is a slow dependency, retry amplification, or thread pool exhaustion — and which resilience pattern would have prevented it

## Motivation Hook

> **Invoke:** `production-war-story` (phase=11)
>
> Story: The Circuit Breaker That Made Things Worse — 5-second recovery became 60-second outage because the circuit breaker timeout was longer than the actual failure.

## Concept Sequence

### Concept A: Timeouts — The Most Important Configuration
> **Invoke:** `concept-deep-dive` (phase=11, concept="timeout-design")

### Concept B: Circuit Breakers, Bulkheads, Retry
> **Invoke:** `concept-deep-dive` (phase=11, concept="circuit-breakers")

### Concept C: Graceful Degradation
> **Invoke:** `concept-deep-dive` (phase=11, concept="graceful-degradation")

### Decision Point
> **Invoke:** `tradeoff-matrix` (decision="circuit-breaker vs bulkhead vs retry-with-backoff")

## Build Specification
> **Invoke:** `prototype-spec` (phase=11)

## Implementation Path
> **Invoke:** `implementation-stepper` (phase=11)

## Failure Lab
> **Invoke:** `failure-lab` (phase=11)

- **Scenario A:** Slow dependency without circuit breaker — observe thread/connection pool exhaustion cascading to all endpoints
- **Scenario B:** Retry storm — all clients retry simultaneously after brief outage
- **Scenario C:** Circuit breaker open → recovery → test request → fail → extended outage (misconfigured half-open)

## Gate Check Criteria

**Scenario question domain:** "Your payment service depends on a third-party fraud detection API. That API occasionally takes 30 seconds to respond (normally 200ms). How do you protect your service?"

**Key markers:**
- Timeout set WAY below 30s (e.g., 2-3s) with fallback behavior
- Circuit breaker to stop calling after N failures
- Graceful degradation: what happens to the user when fraud check is skipped?
- Understanding that retries without jitter WORSEN the problem
- References their cascade failure experiment

**Connection to next phase:** "Your system is resilient and observable. Final phase: how do you PLAN for growth? When do you need to re-architect vs. tune? Phase 12: looking ahead without over-building."
