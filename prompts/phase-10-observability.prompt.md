---
mode: agent
description: "Phase 10 — Observability and Failure Detection: metrics, logs, traces, distributed tracing, and alerting design"
tools:
  - read_file
  - run_in_terminal
  - create_file
  - replace_string_in_file
phase: 10
title: "Observability and Failure Detection"
prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9]
concepts: ["metrics-logs-traces", "distributed-tracing", "symptom-vs-cause-alerting", "observability-cost"]
production_relevance: "You cannot design what you cannot observe. You cannot fix what you cannot diagnose. Observability is not a feature — it's a prerequisite for operating anything."
estimated_time: "5-7 hours"
---

# Phase 10: Observability and Failure Detection

## Phase Contract

By the end of this phase, the learner MUST be able to:
1. **Decide:** For a given failure mode, determine whether metrics, logs, or traces will reveal it — and design the appropriate signal
2. **Predict:** Given an alert definition, predict what it will catch, what it will miss, and what false positives it will produce
3. **Build:** Full observability stack for Phase 9's multi-service system (distributed traces, latency histograms, error rate metrics, structured logs)
4. **Debug:** Given ONLY observability data (no code access), diagnose a latency spike to the specific service, endpoint, and dependency causing it

## Motivation Hook

> **Invoke:** `production-war-story` (phase=10)
>
> Story: The Invisible Degradation — P99 latency crept from 200ms to 4s over two weeks. Nobody noticed until customers churned.

## Concept Sequence

### Concept A: Metrics, Logs, Traces — What Each Reveals
> **Invoke:** `concept-deep-dive` (phase=10, concept="metrics-logs-traces")

### Concept B: Distributed Tracing Mechanics
> **Invoke:** `concept-deep-dive` (phase=10, concept="distributed-tracing")

### Concept C: Alerting on Symptoms vs Causes
> **Invoke:** `concept-deep-dive` (phase=10, concept="symptom-vs-cause-alerting")

### Decision Point
> **Invoke:** `tradeoff-matrix` (decision="full-fidelity observability vs sampling-based with cost control")

## Build Specification
> **Invoke:** `prototype-spec` (phase=10)

## Implementation Path
> **Invoke:** `implementation-stepper` (phase=10)

## Failure Lab
> **Invoke:** `failure-lab` (phase=10)

- **Scenario A:** Inject 2s latency in one downstream service — diagnose via traces only
- **Scenario B:** Intermittent 1% error rate — find root cause via metrics (too rare for individual traces)
- **Scenario C:** Cascading latency across services — identify the ROOT cause, not the downstream symptoms

## Gate Check Criteria

**Scenario question domain:** "It's Monday morning. A dashboard shows P99 latency jumped from 200ms to 2s between Friday night and now. No deploys happened. Walk me through your investigation."

**Key markers:**
- Structured approach: which service? which endpoint? which dependency?
- Uses traces to find a single slow request path, then metrics to confirm it's systemic
- Considers external causes (dependency, network, clock, data growth)
- Doesn't jump to conclusions — follows the data

**Connection to next phase:** "You can see failures now. Phase 11: what do you DO about them? When a dependency is slow, how does your system respond without dying?"
