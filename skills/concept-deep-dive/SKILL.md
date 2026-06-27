---
description: "Delivers first-principles theory for a phase concept. Focuses on mechanisms, trade-offs, failure modes, and real-world consequences. WHEN: teach concept, explain mechanism, mental model, why does X work, how does X actually work, first principles explanation."
---

# Skill: concept-deep-dive

## Description

Delivers the "why it matters" theory for a phase. Focuses on trade-offs, failure modes, and real-world consequences. Builds understanding from first principles — never from definitions.

## Trigger

Invoked by Phase Instructor when entering the MENTAL MODEL step of any phase.

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phase_number` | Number | Yes | Current phase (1-12) |
| `concept_name` | String | Yes | Specific concept to explain |
| `learner_level` | String | No | `foundation` / `intermediate` / `advanced` (default: intermediate) |
| `approach` | String | No | `primary` / `alternative` (for stuck learners) |
| `prior_concepts` | Array | No | Concepts already taught in this phase (avoid repetition) |

## Output Structure

```markdown
## {Concept Name}

### The Problem This Solves
<!-- 2-3 sentences: what breaks without this. Reference the learner's Phase N-1 experience. -->

### How It Actually Works (The Mechanism)
<!-- First-principles explanation of the internal mechanics.
     Not "what it does" — "how it does it" and "why that specific mechanism."
     Use diagrams (mermaid) for anything with state transitions or data flow. -->

### The Part Everyone Gets Wrong
<!-- The most common misconception and why it's wrong.
     Include: what the misconception leads to in production. -->

### Competing Approaches

#### Approach A: {name}
- How it works (1-2 sentences)
- When it's the right choice (specific conditions)
- When it breaks (specific scenario)
- Who uses it in production (real systems)

#### Approach B: {name}
- How it works (1-2 sentences)
- When it's the right choice (specific conditions)
- When it breaks (specific scenario)
- Who uses it in production (real systems)

### Decision Framework
<!-- "Choose A when [conditions]. Choose B when [conditions]. 
     The factor that shifts the balance is [specific thing]." -->

### Connection to What You Already Know
<!-- "In Phase {N-1}, you observed [X]. That's because [mechanism]. 
     This phase's concept is the solution — and it introduces [new problem]." -->
```

## Depth Levels

### Foundation
- Mechanism explanation (single approach, simplified)
- One trade-off
- One failure mode
- One production example
- Connection to previous phase

### Intermediate (default)
- Full mechanism with state diagrams
- 2 competing approaches with trade-off matrix
- 2-3 failure modes with severity ranking
- Multiple production examples
- "The part everyone gets wrong" section
- Connection to previous phase

### Advanced
- Deep mechanism including edge cases and corner cases
- 3+ approaches including less common ones
- Academic references (papers, conference talks)
- "Where the industry still disagrees" section
- Optional advanced exercise that goes beyond phase requirements
- Historical evolution: how this concept was discovered/developed

## Quality Rules

1. **Never start with a definition.** Start with "here's what happens without this" or "here's the problem."
2. **Never say "simply put."** If it were simple, it wouldn't need a concept section.
3. **Never present one approach as universally correct.** Even if one is usually better — show when it isn't.
4. **Always include the mechanism.** "It's a distributed hash table" is not an explanation. "Keys are hashed to a ring, each node owns a range, and here's what happens when a node joins/leaves" is.
5. **Always connect to previous phase.** Learning is cumulative. Isolated concepts don't stick.
6. **Use analogies carefully.** Good analogy: exposes the mechanism (postal system for routing). Bad analogy: hides complexity (database = filing cabinet).

## Anti-Patterns in This Skill

- Listing features without explaining mechanisms
- Using vendor-specific terminology instead of concept-level language
- Explaining what to use without explaining when NOT to use it
- Giving the "senior engineer answer" without building up to it
- Assuming knowledge of concepts from future phases
