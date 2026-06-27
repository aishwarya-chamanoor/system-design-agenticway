---
mode: agent
description: "Phase 1 — The Single Machine Ceiling: resource limits, concurrency models, and saturation measurement"
tools:
  - read_file
  - run_in_terminal
  - create_file
  - replace_string_in_file
phase: 1
title: "The Single Machine Ceiling"
prerequisites: []
concepts: ["resource-limits", "concurrency-on-one-machine", "saturation-measurement"]
production_relevance: "Every system starts on one machine. Knowing where it breaks determines your first scaling decision."
estimated_time: "4-6 hours"
---

# Phase 1: The Single Machine Ceiling

## Phase Contract

By the end of this phase, the learner MUST be able to:
1. **Decide:** Given a service under load, identify WHICH resource will saturate first and justify the prediction with measurements
2. **Predict:** Before running a load test, predict the failure mode (connection refused vs. timeout vs. OOM vs. disk full) and explain why
3. **Build:** An HTTP service with file-backed storage that demonstrates measurable resource saturation under concurrent load
4. **Debug:** Using only system metrics and application logs, determine whether a slowdown is CPU-bound, I/O-bound, memory-bound, or connection-bound

## Motivation Hook

> **Invoke:** `production-war-story` (phase=1)
>
> Story: The 10,000 Connection Meltdown
> A social media API server hit file descriptor limits during a viral event.
> Every new user got "connection refused" — but the server was at 5% CPU.
> The fix was a one-line config change. Finding it took 2 hours.

## Concept Sequence

### Concept A: Finite Resources as Hard Walls
> **Invoke:** `concept-deep-dive` (phase=1, concept="resource-limits")

Key mechanisms to cover:
- File descriptors: what they are, per-process limits, system limits
- Memory: heap vs. stack, GC pressure, OOM killer behavior
- CPU: single-core saturation, context switching cost
- Disk I/O: sequential vs. random, write amplification, fsync semantics
- Network sockets: TIME_WAIT accumulation, port exhaustion

### Concept B: Concurrency Models and Their Costs
> **Invoke:** `concept-deep-dive` (phase=1, concept="concurrency-models")

Key mechanisms to cover:
- Thread-per-connection: simple but resource-heavy
- Event loop: efficient but head-of-line blocking
- Thread pool: bounded but complex
- The relationship between concurrency model and which resource saturates first

### Decision Point
> **Invoke:** `tradeoff-matrix` (decision="thread-per-connection vs event-loop vs thread-pool")

## Build Specification

> **Invoke:** `prototype-spec` (phase=1)

**Summary:** Build an HTTP service that stores data to a file, handles concurrent connections, and instruments itself with resource metrics. Then break it.

**Key constraint:** Single machine. Single process. No external dependencies (no Redis, no Postgres — just the filesystem).

## Implementation Path

> **Invoke:** `implementation-stepper` (phase=1)

Steps:
1. TCP listener accepting connections (log each connection)
2. Request counting and resource monitoring (FD count, memory usage, timestamps)
3. File-backed key-value storage (read/write to a single file)
4. Concurrent request handling (chosen concurrency model)
5. Latency measurement per request (start→end timestamps)
6. Load test harness (concurrent client that ramps up connections)

## Failure Lab

> **Invoke:** `failure-lab` (phase=1)

- **Scenario A:** File descriptor exhaustion — open connections until EMFILE
- **Scenario B:** Disk full mid-write — fill available disk, observe partial writes and corruption
- **Scenario C:** CPU saturation cascade — compute-heavy requests block other connections

## Gate Check Criteria

**Scenario question domain:** "Your single-server API is getting slow under load. Dashboard shows 40% CPU, 30% memory. What's your hypothesis?"

**Key markers of understanding:**
- Knows to check file descriptors / connection count (not just CPU/memory)
- Can explain WHY a resource limit causes a specific symptom
- References their own load test observations
- Mentions measurement BEFORE action

**Common misconceptions to probe:**
- "If CPU isn't 100%, the server has capacity" (wrong: other resources saturate first)
- "Just add more RAM" (wrong: if the bottleneck is FDs or connections)
- "Async is always better" (wrong: head-of-line blocking in event loops)

**Connection to next phase:** "You've hit the ceiling of one machine. Phase 2: what if we add MORE machines? (Spoiler: it's not as simple as it sounds.)"

## Weakness Reinforcement Points

- Phase 10: when building observability, revisit "what metrics would have helped you in Phase 1?"
- Phase 12: when doing capacity planning, revisit resource ceiling estimation
