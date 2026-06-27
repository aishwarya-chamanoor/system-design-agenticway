---
mode: agent
description: "Phase 5 — Async Processing and Queues: delivery guarantees, backpressure, poison messages, and sync/async boundaries"
tools:
  - read_file
  - run_in_terminal
  - create_file
  - replace_string_in_file
phase: 5
title: "Asynchronous Processing and Queues"
prerequisites: [1, 2, 3, 4]
concepts: ["sync-async-boundaries", "delivery-guarantees", "backpressure", "poison-messages"]
production_relevance: "Every system that grows beyond a single request-response cycle needs async processing. Getting delivery semantics wrong causes data loss or infinite loops."
estimated_time: "4-6 hours"
---

# Phase 5: Asynchronous Processing and Queues

## Phase Contract

By the end of this phase, the learner MUST be able to:
1. **Decide:** Where to draw the sync/async boundary in a request flow — and articulate what the user experience trade-off is
2. **Predict:** Given a consumer crash at different points in processing, determine whether the message is lost, duplicated, or correctly retried
3. **Build:** A producer→queue→consumer pipeline with configurable delivery guarantees and backpressure
4. **Debug:** Given a growing queue depth, determine whether it's a slow consumer, poison messages, or producer spike — and choose the correct intervention

## Motivation Hook

> **Invoke:** `production-war-story` (phase=5)
>
> Story: The Infinite Retry Loop — poison message backed up 2 million orders for 6 hours.

## Concept Sequence

### Concept A: Sync/Async Boundaries
> **Invoke:** `concept-deep-dive` (phase=5, concept="sync-async-boundaries")

### Concept B: Delivery Guarantees — What's Actually Achievable
> **Invoke:** `concept-deep-dive` (phase=5, concept="delivery-guarantees")

Key focus: at-least-once vs at-most-once vs exactly-once (and why exactly-once is a lie in distributed systems — it requires idempotency)

### Concept C: Backpressure as Survival
> **Invoke:** `concept-deep-dive` (phase=5, concept="backpressure")

### Decision Point
> **Invoke:** `tradeoff-matrix` (decision="at-least-once with idempotency vs at-most-once with loss acceptance")

## Build Specification
> **Invoke:** `prototype-spec` (phase=5)

## Implementation Path
> **Invoke:** `implementation-stepper` (phase=5)

## Failure Lab
> **Invoke:** `failure-lab` (phase=5)

- **Scenario A:** Kill consumer mid-processing — observe message fate (lost? redelivered? duplicated?)
- **Scenario B:** Producer floods queue beyond consumer capacity — observe backpressure behavior
- **Scenario C:** Poison message that can never be processed — observe queue blockage and dead-lettering

## Gate Check Criteria

**Scenario question domain:** "Your payment processing takes 30 seconds. The API must respond in 500ms. How do you architect this? What does the user see?"

**Key markers:**
- Clear sync/async boundary with user communication strategy (pending state, webhook, polling)
- Delivery guarantee choice with justification (payments = at-least-once + idempotency)
- Mention of dead-letter queue for failures
- Backpressure strategy for overload

**Connection to next phase:** "Your queue pipeline works on one machine. But what if the data store it writes to needs to be available even when machines fail? Phase 6: keeping copies of data in sync — and what happens when they disagree."
