---
description: "Delivers real anonymized production incident narratives to motivate concepts. Creates emotional investment before teaching. WHEN: motivate phase, war story, real incident, does this happen in production, production failure example, 3am pager."
---

# Skill: production-war-story

## Description

Delivers a real (anonymized) production incident narrative to motivate each phase. Creates emotional investment in the concept before it's explained. Makes the learner FEEL the 3am pager alert.

## Trigger

Invoked by Phase Instructor at the opening of each phase (MOTIVATION step). Also invoked when learner asks "does this actually happen in production?"

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phase_number` | Number | Yes | Current phase (1-12) |
| `concept_name` | String | No | Specific concept to motivate (if mid-phase) |
| `tone` | String | No | `dramatic` / `technical` / `humorous` (default: dramatic) |

## Output Structure

```markdown
## War Story: {Incident Title}

### The Setup
{What the system looked like. What the team believed was true about it.
 Make it relatable: "Team of 5. Series B startup. Fast-growing."}

### The Day Everything Was Fine
{Brief picture of normal operations. Lull before the storm.
 Include specific numbers: requests/sec, response times, team confidence level.}

### The Trigger
{What changed. Be specific: deploy, traffic spike, clock skew, network event,
 an intern's first production change, a config file with a typo.}

### 3:47 AM
{The alert/symptom. What the on-call engineer saw first.
 Make it visceral: phone buzzing, dashboard turning red, customer tweets.}

### The Investigation (Wrong Turns Included)
{How they debugged it. Include:
 - What they checked first (and why it was a red herring)
 - What they ALMOST did that would have made it worse
 - The 20-minute period where they thought it was something else entirely
 - The moment of realization}

### The Root Cause
{Connected DIRECTLY to this phase's concept.
 "If they had understood [concept], they would have [prevented/detected/recovered faster]."}

### The Fix
- **Immediate (that night):** {what they did to stop the bleeding}
- **Short-term (that week):** {what they changed to prevent recurrence}
- **Long-term (that quarter):** {architectural change that addressed the root cause}

### The Bill
{Consequences: downtime duration, data lost, customers affected, revenue impact,
 trust eroded, post-mortem meetings, process changes.}

### The Lesson
"If you understand Phase {N}'s concept deeply, this incident becomes:
 - Preventable by: {design choice}
 - Detectable by: {monitoring/alerting}
 - Recoverable in {minutes not hours} by: {operational procedure}"
```

## Story Sourcing

Stories are composites drawn from:
- Public postmortems (GitHub, Cloudflare, Google, AWS, Stripe incident reports)
- Conference talks about production failures (Strange Loop, SREcon, QCon)
- Common patterns seen across many companies (anonymized and combined)

Never attribute to a specific company unless the incident report is public.

## Phase-Specific War Stories

### Phase 1: The 10,000 Connection Meltdown
A social media startup's API server ran out of file descriptors during a viral event. Every new connection got "connection refused." The fix took 3 minutes — but finding it took 2 hours because they assumed it was a code bug.

### Phase 2: The Stateful "Stateless" Service
An e-commerce site stored shopping carts in local memory "temporarily." When they scaled to 4 instances, customers lost cart items randomly. The CEO got a support ticket from a customer who lost a $2,000 cart THREE TIMES.

### Phase 3: The Acknowledged-But-Lost Writes
A fintech startup told users "payment confirmed" before flushing to disk. A kernel panic lost 47 transactions. They had to manually reconcile with bank records. Two engineers worked 72 hours straight.

### Phase 4: The Cache That Ate The Database
A content platform's cache expired simultaneously across all keys (TTL aligned to deploy time). 100% of traffic hit the database. It took 45 minutes to recover because the cache-warming job was slower than the traffic.

### Phase 5: The Infinite Retry Loop
An order processing system retried failed messages infinitely. A malformed message from a partner API couldn't be processed. The queue backed up to 2 million messages. Legitimate orders were delayed 6 hours.

### Phase 6: The Replication Lag Surprise
A social platform served profile reads from replicas. Replication lag hit 30 seconds during a traffic spike. Users updated their profile, refreshed, and saw the OLD data. Support tickets: "your site is deleting my changes."

### Phase 7: The Celebrity Hot Partition
A messaging app sharded by user ID. A celebrity with 50M followers sent a message. One shard handled ALL the fan notification lookups. That shard melted. Other shards were at 2% capacity.

### Phase 8: The Split-Brain Incident
A distributed lock service had a network partition. Both sides elected a leader. Both sides accepted writes. When the partition healed, 6 hours of conflicting data had to be manually reconciled. Some was unrecoverable.

### Phase 9: The Saga That Couldn't Compensate
An e-commerce checkout saga: reserve inventory → charge card → ship. The shipping service failed. Compensation: refund card + release inventory. But the refund API was also down. Customer was charged with no order and no refund for 3 days.

### Phase 10: The Invisible Degradation
A microservices platform had no distributed tracing. P99 latency crept from 200ms to 4s over two weeks. Nobody noticed until customers churned. Root cause: a downstream service was doing full table scans after a schema migration.

### Phase 11: The Circuit Breaker That Made Things Worse
A circuit breaker opened when a payment service was briefly slow. It stayed open for 60 seconds (configured timeout). During those 60 seconds, ALL payments failed — even though the service recovered in 5 seconds. Revenue impact: $180K.

### Phase 12: The Growth That Broke Everything
A SaaS startup hit product-market fit. Traffic grew 8x in 3 weeks. They hadn't done capacity planning. The database connection pool maxed out first (not CPU, not memory — connections). One config change could have bought them 3 months.

## Tone Guidelines

- **Dramatic (default):** Emphasis on the human experience. 3am calls. Stress. The moment of realization.
- **Technical:** Emphasis on the system behavior. Numbers. Graphs. Timeline.
- **Humorous:** Emphasis on the absurdity. The simple thing that would have prevented it. The irony.

All tones must still deliver the lesson clearly. Entertainment serves education, never replaces it.
