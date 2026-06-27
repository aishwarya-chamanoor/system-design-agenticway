---
description: "Generates prescribed failure scenarios to execute against prototypes. Includes setup, prediction, execution, observation, and debrief. WHEN: break it, inject failure, failure scenario, what breaks, induce crash, kill process, simulate partition, test resilience."
---

# Skill: failure-lab

## Description

Provides specific, prescribed failure scenarios for the learner to execute against their prototype. Each scenario includes setup, prediction prompt, execution steps, observation guide, and debrief questions. Designed to make system behavior under failure VISIBLE and MEMORABLE.

## Trigger

Invoked by Phase Instructor after Code Reviewer passes the prototype. The prototype must be working correctly before failures are induced.

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phase_number` | Number | Yes | Current phase (1-12) |
| `prototype_description` | String | Yes | What the learner built (from code review) |
| `learner_stack` | String | Yes | Language/framework used |
| `difficulty` | String | No | `standard` / `advanced` (default: standard) |

## Output Structure

```markdown
## Failure Lab — Phase {N}: {Title}

Your prototype is working. Good. Now we break it.

The goal isn't to find bugs in YOUR code. The goal is to observe how 
SYSTEMS BEHAVE when components fail. These are the failures that happen 
in production whether your code is "correct" or not.

---

### Scenario A: {Name} — {1-line description}
**Difficulty:** ★☆☆ (mechanism discovery)
**Production frequency:** {how often this actually happens}

#### Setup
{Exact state the system should be in before the failure.}
- Ensure {precondition 1}
- Ensure {precondition 2}
- Start monitoring {specific signal}

#### Prediction
> Before you break it: What do you think happens to {specific observable}?
> Write down your prediction. Be specific — "it breaks" is not a prediction.
> Predict: the symptom, the timing, and whether it's silent or loud.

#### Execution
1. {Exact step to induce failure}
2. {Exact step to induce failure}
3. Wait {duration} and observe

#### What to Watch
- **Primary signal:** {what to look at first}
- **Secondary signal:** {confirming evidence}
- **Absence signal:** {what STOPS happening that should be happening}

#### Expected Behavior
- Within {timeframe}: {what should happen}
- If you see {X}: it means {Y}
- If you DON'T see {X}: your prototype is accidentally avoiding the problem — 
  {what to check and adjust}

#### Debrief
1. Was the failure **silent or loud**? Which is worse in production and why?
2. How long between {failure event} and {visible symptom}? What fills that gap?
3. If this happened at 3am, would your current monitoring catch it?
4. What would you add to PREVENT this? What would you add to DETECT this faster?

---

### Scenario B: {Name} — {1-line description}
**Difficulty:** ★★☆ (detection challenge)
**Production frequency:** {how often this actually happens}

{Same structure as Scenario A}

---

### Scenario C: {Name} — {1-line description} [ADVANCED]
**Difficulty:** ★★★ (cascading/compound failure)
**Production frequency:** {less common but catastrophic when it happens}

{Same structure as Scenario A, but the failure is a COMBINATION or SEQUENCE}

---

## Post-Lab Synthesis

After completing all scenarios, write:
1. Which failure was most surprising? Why?
2. Which failure would be hardest to detect in production? What alert would you create?
3. What assumption did you have before the lab that you no longer hold?
```

## Scenario Design Principles

1. **Scenario A is always the foundational failure.** The one that directly exposes the phase concept. If you understand nothing else, understand this one.

2. **Scenario B is always the subtle failure.** The one that's HARD TO DETECT. Silent data corruption. Gradual degradation. The thing that looks fine until it isn't.

3. **Scenario C is always the compound failure.** Two things go wrong at once, or one failure triggers another. This is "production at scale" territory.

4. **Every scenario must be reproducible.** No "wait for a rare event." The learner must be able to trigger it on demand.

5. **Every scenario must be observable.** If the learner can't SEE what happened, the scenario is useless.

## Phase-Specific Failure Scenarios

### Phase 1: Single Machine Ceiling
- A: File descriptor exhaustion (open connections until EMFILE)
- B: Disk full mid-write (fill disk, observe partial writes)
- C: CPU saturation + connection timeout cascade

### Phase 2: Stateless Scaling
- A: Kill one instance mid-request (observe dropped connections)
- B: Introduce slow instance (one instance takes 10x longer — observe load imbalance)
- C: All instances restart simultaneously (thundering herd on state store)

### Phase 3: Data Storage
- A: Kill process mid-write (observe data loss with and without WAL)
- B: Corrupt WAL file (observe recovery behavior)
- C: Concurrent writers + crash (observe which writes survive)

### Phase 4: Caching
- A: Restart cache with empty state under load (stampede)
- B: Update source data, observe stale cache duration
- C: Hot key + cache expiry (single key stampede)

### Phase 5: Async & Queues
- A: Kill consumer mid-processing (observe message fate)
- B: Producer floods queue beyond consumer capacity (backpressure)
- C: Poison message (message that always fails processing)

### Phase 6: Replication
- A: Kill leader, observe follower behavior
- B: Introduce 5-second replication lag, read from follower
- C: Network partition between leader and follower, write to both

### Phase 7: Sharding
- A: Send 80% of traffic to one shard (hot partition)
- B: Kill one shard, observe requests for missing data
- C: Add new shard during traffic (rebalancing under load)

### Phase 8: Consensus
- A: Kill one node in 3-node cluster (should survive)
- B: Partition network: 2 nodes vs 1 node (minority must step down)
- C: Symmetric partition: each node thinks it's the leader (split-brain)

### Phase 9: Service Decomposition
- A: Fail step 3 of saga after steps 1-2 succeed (compensation)
- B: Slow service (not dead — 30-second timeout)
- C: Compensation itself fails (saga stuck in inconsistent state)

### Phase 10: Observability
- A: Inject 2s latency in one downstream service (diagnose via traces)
- B: Intermittent errors at 1% rate (find via metrics, not individual traces)
- C: Cascading latency (A→B→C, find the ROOT cause, not the symptom)

### Phase 11: Resilience
- A: Slow dependency without circuit breaker (observe thread/connection pool exhaustion)
- B: Retry storm (all clients retry simultaneously after brief outage)
- C: Circuit breaker opens → recovery attempt → fails → extended outage

### Phase 12: Capacity
- A: 10x traffic spike (validate or disprove capacity estimate)
- B: Gradual resource leak under sustained load (slow degradation)
- C: Cascading failure from weakest component at 10x load
