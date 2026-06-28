# System Design Roadmap — GitHub Copilot Multi-Agent Learning System

A 12-phase progressive learning architecture that takes engineers from single-service CRUD to production-grade distributed systems through interleaved theory, hands-on building, and deliberate failure injection.

Built for **GitHub Copilot** in VS Code using custom agents, skills, and prompts.

## Architecture

```
Learner → @orchestrator → @phase-instructor → Skills (concept, build, break)
                        → @code-reviewer
                        → @gate-keeper → interview-simulator
                        → @socratic-adversary
```

## Quick Start

1. Open this workspace in VS Code with GitHub Copilot enabled
2. Open Copilot Chat and invoke: `@orchestrator Start the system design roadmap`
3. Follow the phase sequence — no skipping
4. Use phase prompts directly: open command palette → "Run Prompt" → select a phase

## Project Structure

```
├── .github/
│   ├── copilot-instructions.md   # Workspace-level Copilot instructions
│   └── agents/                   # Custom Copilot agents (.agent.md)
│       ├── orchestrator.agent.md
│       ├── phase-instructor.agent.md
│       ├── code-reviewer.agent.md
│       ├── gate-keeper.agent.md
│       └── socratic-adversary.agent.md
├── skills/                       # Copilot skills (SKILL.md per skill)
│   ├── concept-deep-dive/SKILL.md
│   ├── tradeoff-matrix/SKILL.md
│   ├── prototype-spec/SKILL.md
│   ├── implementation-stepper/SKILL.md
│   ├── failure-lab/SKILL.md
│   ├── production-war-story/SKILL.md
│   └── interview-simulator/SKILL.md
├── prompts/                      # Reusable prompts (.prompt.md) — 12 phases
│   ├── phase-01-single-machine-ceiling.prompt.md
│   ├── phase-02-stateless-scaling.prompt.md
│   └── ... (through phase-12)
├── knowledge/                    # Structured knowledge stores (JSON)
│   ├── failure-catalog.json
│   ├── anti-patterns.json
│   └── production-patterns.json
└── state/                        # Learner progress tracking
    └── learner-state.json
```

## How It Works

### Agents (`@agent-name`)
Invoke agents in Copilot Chat using `@agent-name`. Each has a specific role:

| Agent | Role | When to Use |
|-------|------|-------------|
| `@orchestrator` | Session manager, progress tracker | Start/continue, navigate phases |
| `@phase-instructor` | Deep teaching, guided building | Learning concepts, building prototypes |
| `@code-reviewer` | Prototype validation | Submit code for review |
| `@gate-keeper` | Assessment via scenario questions | Ready to advance to next phase |
| `@socratic-adversary` | Challenge assumptions | "Why not just X?", defend decisions |

### Skills (auto-discovered)
Skills are invoked by agents automatically based on the teaching flow:

| Skill | Purpose |
|-------|---------|
| `concept-deep-dive` | First-principles mechanism explanations |
| `tradeoff-matrix` | Structured trade-off analysis for decisions |
| `prototype-spec` | Minimal prototype specifications |
| `implementation-stepper` | Step-by-step build guidance |
| `failure-lab` | Prescribed failure injection scenarios |
| `production-war-story` | Real incident narratives for motivation |
| `interview-simulator` | Scenario-based gate-check questions |

### Prompts (selectable)
Phase prompts can be run directly from the VS Code command palette or referenced by agents. Each contains the full teaching plan for one phase.

## Design Principles

- **No skipping**: Each phase builds on the previous one's artifacts
- **Production-ready bar**: Gate check validates judgment, not recall
- **Failure-first**: Every concept is motivated by what breaks without it
- **Adaptive depth**: System detects learner level and adjusts
- **Cross-phase reinforcement**: Weak areas are revisited in later phases

---

## How the Agents Work Together

The system is a **multi-agent learning loop** where each agent owns a distinct role. No agent does another's job.

### Agent Interaction Flow

```mermaid
flowchart TD
    L[Learner] -->|start / continue / next| O[@orchestrator]
    O -->|reads & writes| S[state/learner-state.json]
    O -->|dispatches phase context| PI[@phase-instructor]
    O -->|dispatches code + phase| CR[@code-reviewer]
    O -->|dispatches synthesis + phase| GK[@gate-keeper]
    O -->|dispatches topic + challenge| SA[@socratic-adversary]

    PI -->|1. motivation| WS[production-war-story skill]
    PI -->|2. theory| CD[concept-deep-dive skill]
    PI -->|3. trade-offs| TM[tradeoff-matrix skill]
    PI -->|4. spec| PS[prototype-spec skill]
    PI -->|5. guided build| IS[implementation-stepper skill]
    PI -->|6. break it| FL[failure-lab skill]
    PI -->|7. journal| LJ[learning-journal skill]

    GK -->|PASS| O
    GK -->|FAIL - weak areas| O
    O -->|unlocks next phase| S
```

### Agent Roles

| Agent | Trigger | Responsibility |
|---|---|---|
| `@orchestrator` | `start`, `continue`, `next`, `where am I` | Reads/writes `learner-state.json`. Routes to the right specialist. Enforces phase gating. Never lets you skip. |
| `@phase-instructor` | Dispatched by orchestrator per phase | Owns the full **theory → build → break** arc for one phase. Invokes all 7 skills in sequence. |
| `@code-reviewer` | `review my code` | Reviews prototypes for **conceptual correctness** — not style. Checks whether the code will actually expose the failure mode the phase requires. |
| `@gate-keeper` | `I'm done` / `gate check` / `ready for next` | Presents a realistic production scenario. Awards a PASS only if the learner demonstrates **judgment under ambiguity**, not memorized facts. |
| `@socratic-adversary` | `why not just X?` / expressed certainty | Challenges assumptions with concrete counter-scenarios. Forces the learner to find the boundary condition of their own decisions. |

### The Phase Lifecycle

Each of the 12 phases follows this locked sequence — no sub-step can be skipped:

```
1. Motivation     → production-war-story skill   (feel the pain first)
2. Mental Model   → concept-deep-dive skill       (first principles, not definitions)
3. Trade-offs     → tradeoff-matrix skill          (when would you pick each?)
4. Build Spec     → prototype-spec skill           (what to actually build)
5. Build          → implementation-stepper skill   (guided steps, not full solutions)
6. Break It       → failure-lab skill              (inject failures deliberately)
7. Gate Check     → @gate-keeper agent             (scenario-based validation)
```

### State File as the Contract

`state/learner-state.json` is what ties all agents together. It tracks:

- `current_phase` — where the learner is right now
- Per-phase: `theory`, `hands_on`, `break_it`, `gate` — each with `completed: true/false`
- `gate.weak_areas` — fed back into later phases to revisit gaps
- Phases 2–12 are `"locked"` until the previous phase is fully gated

The orchestrator reads this before every dispatch and writes it after every significant interaction.
