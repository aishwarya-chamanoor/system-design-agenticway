---
description: "Documents learner's key insights, concept summaries, and aha-moments at the end of each phase sub-step. Creates a revisitable learning log. WHEN: document learnings, save notes, what did I learn, journal entry, phase summary, record insights."
---

# Skill: learning-journal

## Description

Maintains a per-phase learning journal that captures the learner's own understanding in their own words. Generates structured entries at key moments and compiles phase summaries.

## Trigger

Invoked at the end of each sub-step (motivation, concept, decision, build, break-it, gate) or when the learner explicitly asks to document something.

## Output Location

All journal entries are written to `state/journal/phase-{NN}.md` (e.g., `state/journal/phase-01.md`).

## Journal Prompting Protocol

At each sub-step completion, ask the learner:

1. **After motivation:** "In one sentence — what's the lesson from that war story?"
2. **After each concept:** "Explain {concept} back to me in your own words. I'll capture it in your journal."
3. **After decision point:** "Which approach would you pick and what are you giving up?"
4. **After build:** "What was the hardest part? What prediction did you get wrong?"
5. **After break-it:** "Which failure surprised you most? What alert would you create?"
6. **After gate:** "One sentence: what does Phase {N} mean to you now?"

## Entry Sections

Each phase journal has these sections, added progressively as the learner completes sub-steps:

### Motivation — What breaks without this
- **Date:** {date}
- **War story:** {1-line summary of the incident}
- **My takeaway:** {learner's own words — prompted, not generated}

### Concept: {concept-name}
- **Date:** {date}
- **In my own words:** {learner explains it back}
- **Key terms I learned:**
  - **{term}**: {plain-language definition}
- **What surprised me:** {the thing they didn't expect}
- **Connection to previous phase:** {how this builds on what came before}

### Decision Point: {decision}
- **Date:** {date}
- **My choice:** {which approach they'd pick}
- **Why:** {their reasoning}
- **What I'd give up:** {the trade-off they accept}

### Build Log
- **Date:** {date}
- **What I built:** {1-2 sentences}
- **Stack used:** {language/framework}
- **Hardest part:** {what was tricky}
- **Prediction that was wrong:** {the most instructive mismatch}

### Break-It Log
- **Date:** {date}
- **Most surprising failure:** {which scenario}
- **What I predicted vs what happened:** {the gap}
- **What I'd monitor in production:** {the alert they'd create}

### Gate Check Reflection
- **Date:** {date}
- **Passed:** {yes/no}
- **Strongest answer:** {what they felt confident about}
- **Weakest area:** {what they need to revisit}
- **One-sentence synthesis:** {their summary of the entire phase}

## Rules

1. **Learner's words, not generated summaries.** Prompt them to articulate. Don't write it for them.
2. **Capture terms they didn't know.** When a learner asks "what does X mean?" — add it to the Key Terms section.
3. **Record prediction mismatches.** These are the most valuable learning moments.
4. **Keep it brief.** Each entry should be scannable in 30 seconds.
5. **Create the file on first entry.** Don't pre-populate future sections.
6. **Always include examples.** When a concept or term is explained with an analogy, code snippet, diagram, or concrete scenario during conversation, include that same example in the journal entry. Examples are what make concepts stick when revisiting later.
