---
description: "Progressive step-by-step build guidance using prediction-observation loops. Never gives full solutions — gives milestones with hints. WHEN: guide implementation, next step, how to build, step by step, I'm stuck, decompose step, what to implement next."
---

# Skill: implementation-stepper

## Description

Provides progressive step-by-step build instructions for the hands-on prototype. Uses prediction→observation→reconciliation loops at each checkpoint. Never gives full solutions — gives milestones with hints.

## Trigger

Invoked by Phase Instructor during the GUIDED IMPLEMENTATION step. Called repeatedly as learner progresses.

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phase_number` | Number | Yes | Current phase (1-12) |
| `prototype_spec` | Object | Yes | The spec from prototype-spec skill |
| `learner_stack` | String | Yes | Chosen language/framework |
| `current_step` | Number | No | Which step learner is on (default: 1) |
| `learner_stuck` | Boolean | No | Whether learner needs decomposition |
| `learner_prediction` | String | No | What learner predicted before running |
| `learner_observation` | String | No | What learner actually observed |

## Output Structure — Single Step

```markdown
## Step {N} of {total}: {Step Title}

### What to Implement
{One specific capability to add. Concrete and scoped.}

### Why This Step Matters
{1 sentence connecting this step to the phase's learning objective.}

### Checkpoint
Before running:
> **Prediction prompt:** "{Specific question about what will happen when they run this}"
> Write your prediction before continuing.

After running:
> **Observation prompt:** "Run it now. {What specific thing to look at}. 
> Does it match your prediction? If not — that mismatch IS the learning."

### Hints (reveal only if stuck)
<details>
<summary>Hint 1: Direction</summary>
{General approach without code}
</details>

<details>
<summary>Hint 2: Key insight</summary>
{The specific realization needed}
</details>

<details>
<summary>Hint 3: Pseudocode</summary>
{Language-agnostic pseudocode — NOT copy-paste solution}
</details>

### Next Step Preview
{One sentence about what Step N+1 will add and why.}
```

## Step Decomposition (When Stuck)

If `learner_stuck = true`, decompose the current step into 3 sub-steps:

```markdown
## Step {N} — Decomposed

Looks like this step is bigger than expected. Let's break it down:

### Step {N}a: {Foundation piece}
{The simplest working version of this step — even if incomplete}
Checkpoint: "Does it compile/run at all?"

### Step {N}b: {Core logic}
{The actual mechanism — the hard part, isolated}
Checkpoint: "Does it handle the basic case?"

### Step {N}c: {Integration}
{Connecting it to what already exists}
Checkpoint: "Does the full flow work end-to-end?"
```

## Prediction-Observation Reconciliation

When learner reports a mismatch between prediction and observation:

```markdown
## Mismatch Analysis

**You predicted:** {learner's prediction}
**You observed:** {learner's observation}

**Why the mismatch:** {Explanation connecting to the phase concept}

**What this reveals:** {The system behavior principle at work}

**Updated mental model:** {How to think about this going forward}

This mismatch is not a bug in your code — it's a feature of [the concept].
In production, this manifests as [real-world consequence].
```

## Adaptation Rules

| Learner Signal | Response |
|----------------|----------|
| Completes steps quickly, predictions match | Increase step size, reduce hints, add optional challenges |
| Predictions consistently wrong | Slow down, add more checkpoints, revisit relevant concept |
| Stuck for >10 min on a step | Offer decomposition: "Want me to break this into smaller pieces?" |
| Diverges from spec | Let them. Wait for the natural consequence. Then: "What did you observe?" |
| Asks "is this right?" | Don't answer directly: "Run it. What does the output tell you?" |
| Asks "what should I do next?" | Give ONLY the next step. Never look ahead. |

## Step Sequencing Principles

1. **Each step produces a running (if incomplete) system.** No step should leave things in a broken state.
2. **Early steps create the observation mechanism.** Logging, metrics, timestamps come FIRST — not last.
3. **The hardest concept step comes in the middle.** Bookended by simpler setup and integration steps.
4. **The last step before failure-lab must produce the "happy path."** Everything works — THEN we break it.
5. **Never more than 8 steps per phase.** If it needs more, the prototype spec is too complex.

## Step Templates by Phase

### Phase 1 (Single Machine) — 6 steps
1. Basic TCP/HTTP listener accepting connections
2. Add connection counting and logging (observation mechanism)
3. Add file-backed storage for requests
4. Add concurrent request handling
5. Add resource monitoring (FD count, memory, CPU in logs)
6. Load test until something breaks — observe which resource dies first

### Phase 2 (Stateless Scaling) — 6 steps
1. Extract state from Phase 1 service into external store
2. Run second instance of the service
3. Add request router (round-robin) in front of both
4. Add request tracing (which instance handled which request)
5. Add instance health checking
6. Route traffic and observe distribution under load

### Phase 3 (Storage) — 7 steps
1. File-backed key-value store (single reader/writer)
2. Add write-ahead log (write log entry BEFORE data)
3. Add concurrent writer support
4. Add basic indexing (hash map to file offsets)
5. Measure read latency with and without index
6. Add crash-recovery: replay WAL on startup
7. Verify durability: write → kill → restart → verify data

### Phase 4-12: Similar progressive structure
{Detailed steps generated dynamically based on prototype-spec output}
