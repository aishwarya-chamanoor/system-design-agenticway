---
description: "Generates scenario-based assessment questions testing production judgment under ambiguity. Adaptive multi-round format. WHEN: gate check, assess understanding, ready for next phase, interview question, test judgment, scenario question."
---

# Skill: interview-simulator

## Description

Generates scenario-based questions that test production judgment for the gate-keeper agent. Questions assess whether the learner can DECIDE under ambiguity — not recite facts.

## Trigger

Invoked by Gate Keeper agent during the gate check, or by learner explicitly requesting practice.

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phase_number` | Number | Yes | Current phase being assessed |
| `concepts_covered` | Array | Yes | List of concepts taught in this phase |
| `learner_weakness_map` | Object | No | Known weak areas from previous phases |
| `round` | Number | No | Which round of gate check (1, 2, or 3) |
| `previous_answer` | String | No | Learner's answer to previous round (for adaptive follow-up) |

## Output Structure

### Round 1: Scenario Question

```markdown
## Scenario

You're the tech lead on a team of 4 engineers building {realistic system description}.

**Current state:** {system context relevant to this phase's concepts}

**Monday morning:** {triggering event that creates a decision point}

**Constraints:**
- {Business constraint that creates tension}
- {Technical constraint that limits options}
- {Time constraint that prevents perfect solutions}

**Your team proposes:**
- Engineer A argues for {approach aligned with one side of the trade-off}
- Engineer B argues for {approach aligned with the other side}

**Questions:**
1. What do you recommend and why?
2. What's the biggest risk with your recommendation?
3. What would you monitor in the first week to validate your choice?
4. Under what conditions would you reverse this decision?
```

### Round 2: Counter-Argument

```markdown
## Challenge

{Based on learner's Round 1 answer}

Interesting. But consider this:

**New information:** {constraint change that challenges their answer}

OR

**Colleague's pushback:** "I disagree. Here's why: {legitimate counter-argument based on a different prioritization of trade-offs}."

**Questions:**
1. Does your recommendation change? Why or why not?
2. Where is the threshold — at what point would you switch approaches?
3. Is there a hybrid approach? What would you trade for it?
```

### Round 3: Teaching Check

```markdown
## Teach It

A junior engineer just joined your team. They ask:

"Hey, I saw {concept from this phase} mentioned in our architecture doc. 
Why do we do it this way? Couldn't we just {naive alternative}?"

Explain it to them in 3-4 sentences. Assume they're smart but have never 
built a distributed system.
```

## Scenario Generation Principles

1. **Realistic, not contrived.** The scenario should sound like a real team discussion, not an exam question.

2. **No single correct answer.** Both proposed approaches must be defensible under different constraints. The question tests whether the learner can REASON about trade-offs, not pick the "right" one.

3. **Grounded in the phase's prototype.** The scenario should be close enough to what they built that they can draw on hands-on experience.

4. **Include business context.** "The product launch is in 2 weeks" or "We have 500K users and growing 20% month-over-month" — because production decisions always have business constraints.

5. **The follow-up must be adaptive.** Round 2's challenge depends on what they said in Round 1. Don't pre-generate Round 2.

## Evaluation Criteria (for Gate Keeper)

### Strong Indicators (suggests PASS):
- References their prototype experience: "When I built X, I observed Y, which tells me..."
- Articulates both sides of the trade-off before choosing
- Mentions monitoring/validation: "I'd watch for..."
- Comfortable with uncertainty: "It depends on... if A then X, if B then Y"
- Can identify the reversal condition: "I'd switch if..."
- Mentions failure modes unprompted

### Weak Indicators (suggests NOT YET):
- Recites definition without applying to scenario
- Gives single "correct answer" without acknowledging trade-off
- Cannot connect to their hands-on experience
- No mention of monitoring or validation
- Cannot adapt when constraints change
- Over-simplifies: "Just use X" without conditions

### Red Flags (definite NOT YET):
- Proposes solution that their own prototype proved doesn't work
- Cannot explain WHY their break-it scenario produced the result it did
- Contradicts something they correctly stated earlier (didn't internalize)
- Appeals to authority ("the book says...") instead of reasoning

## Phase-Specific Scenario Themes

| Phase | Scenario Domain | Core Tension |
|-------|----------------|--------------|
| 1 | Service under sudden traffic spike | Scale up vs. shed load vs. queue |
| 2 | Deploying new version of stateless service | Zero-downtime deploy strategy |
| 3 | Database upgrade with durability guarantee | Migration with no data loss |
| 4 | Cache configuration for new feature launch | Freshness vs. performance vs. cost |
| 5 | Processing pipeline handling payment events | Exactly-once semantics in practice |
| 6 | Read replica strategy for global users | Consistency requirement per use case |
| 7 | Re-sharding a growing database | Online migration without downtime |
| 8 | Leader election after a network event | Consensus trade-offs under time pressure |
| 9 | Adding a new service to an existing saga | Service boundary and failure handling |
| 10 | Debugging a latency regression in production | Diagnosis with incomplete telemetry |
| 11 | Configuring resilience for a payment dependency | Timeout/retry/circuit-breaker tuning |
| 12 | Planning for 10x growth next quarter | Capacity planning with uncertainty |
