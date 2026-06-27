---
description: "Produces structured trade-off analysis for design decisions. Shows gains, costs, failure modes, and decision heuristics. WHEN: compare approaches, trade-off analysis, which should I choose, decision matrix, pros and cons, when to use A vs B."
---

# Skill: tradeoff-matrix

## Description

For any design decision within a phase, produces a structured trade-off analysis that makes the decision space visible. Shows what you gain, what you lose, when it breaks, and what shifts the balance.

## Trigger

Invoked by Phase Instructor at decision points, by Code Reviewer when evaluating design choices, and by Socratic Adversary when challenging assumptions.

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `decision_point` | String | Yes | The design choice (e.g., "leader-based vs leaderless replication") |
| `phase_number` | Number | Yes | Current phase for context |
| `options` | Array | No | Specific options to compare (default: inferred from decision_point) |
| `learner_context` | String | No | What the learner is building (for relevance weighting) |

## Output Structure

```markdown
## Trade-off Analysis: {Decision Point}

### The Core Tension
<!-- 1-2 sentences: what fundamental quality you're trading between.
     e.g., "This is fundamentally a consistency vs. availability trade-off,
     but the real question is: which failure mode is acceptable to YOUR users?" -->

### Decision Matrix

| Dimension | {Option A} | {Option B} |
|-----------|-----------|-----------|
| **What you gain** | {specific benefit} | {specific benefit} |
| **What you lose** | {specific cost} | {specific cost} |
| **Latency profile** | {characterization} | {characterization} |
| **Failure mode** | {what breaks and how} | {what breaks and how} |
| **Recovery story** | {what recovery looks like} | {what recovery looks like} |
| **Operational burden** | {what ops team deals with} | {what ops team deals with} |
| **Who uses this** | {real production systems} | {real production systems} |
| **When it shines** | {ideal conditions} | {ideal conditions} |
| **When it kills you** | {worst-case scenario} | {worst-case scenario} |

### The Thing People Forget
<!-- The non-obvious dimension that most engineers miss when making this decision.
     e.g., "Everyone compares throughput. Nobody compares operational recovery time 
     at 3am when your on-call engineer has 5 minutes of context." -->

### Decision Heuristic
<!-- Actionable decision guide:
     "Choose A when: [specific, testable conditions]"
     "Choose B when: [specific, testable conditions]"
     "The factor that ACTUALLY shifts the balance in production: [specific thing]" -->

### What Seniors Argue About
<!-- Genuine disagreement in the industry about this choice.
     Not a "correct answer" — an honest representation of the debate. -->

### For YOUR Prototype
<!-- Direct application to what the learner is building:
     "Given that your prototype needs to demonstrate [X], 
     option [Y] will expose the learning objective better because [reason]." -->
```

## Multi-Option Format (3+ options)

When comparing more than 2 options, use a radar chart description:

```markdown
### Quick Comparison

| Quality         | Option A | Option B | Option C |
|-----------------|----------|----------|----------|
| Consistency     | ★★★★★   | ★★★☆☆   | ★★☆☆☆   |
| Availability    | ★★☆☆☆   | ★★★★☆   | ★★★★★   |
| Simplicity      | ★★★★☆   | ★★★☆☆   | ★★☆☆☆   |
| Debuggability   | ★★★★★   | ★★★☆☆   | ★☆☆☆☆   |
| Operational cost| ★★☆☆☆   | ★★★☆☆   | ★★★★★   |

### The Real Question
"Don't ask which has the most stars. Ask: which quality are you 
LEAST willing to sacrifice? That's your answer."
```

## Quality Rules

1. **No false equivalences.** If one option is genuinely better in 90% of cases, say so — then show the 10%.
2. **Include operational reality.** Theoretical trade-offs are incomplete without "what does the on-call engineer deal with?"
3. **Name real systems.** Don't say "some databases use X." Say "PostgreSQL uses X because [reason], DynamoDB uses Y because [different reason]."
4. **Show the spectrum, not the binary.** Most decisions have a dial, not a switch. Show where on the spectrum different choices fall.
5. **Always end with application to the learner's prototype.** Theory without application is trivia.

## Common Decision Points by Phase

| Phase | Core Decision |
|-------|--------------|
| 1 | Vertical scaling vs. accepting the ceiling |
| 2 | Session affinity vs. shared-nothing |
| 3 | Write-ahead log flush frequency (durability vs. throughput) |
| 4 | TTL-based vs. event-driven invalidation |
| 5 | At-least-once vs. at-most-once delivery |
| 6 | Sync vs. async replication |
| 7 | Hash vs. range partitioning |
| 8 | Consensus vs. eventual consistency |
| 9 | Synchronous calls vs. choreography vs. orchestration |
| 10 | Sampling vs. full-fidelity observability |
| 11 | Circuit breaker vs. bulkhead vs. retry |
| 12 | Build for current load vs. build for projected load |
