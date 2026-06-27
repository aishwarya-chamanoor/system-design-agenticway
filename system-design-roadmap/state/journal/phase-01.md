# Phase 1: The Single Machine Ceiling — Learning Journal

## Motivation — What breaks without this

**Date:** 2026-06-24

**War story:** The 10,000 Connection Meltdown — social media API hit OS file descriptor limit (1,024) during viral traffic spike. CPU at 5%, memory at 40%, but server refused all new connections. 47-minute outage for a one-line fix.

**Key insight:** The server had plenty of CPU and memory headroom — but hit an invisible wall (file descriptors) that nobody was monitoring. The team spent 20 minutes debugging because they were looking at the wrong resources.

**My initial thought:** "Rate limiting wasn't in place" — but rate limiting would have targeted the wrong bottleneck. The FD limit (1,024) was far below any reasonable rate limit threshold.

**Actual lesson:** You can't protect against a ceiling you don't know exists. Before adding rate limits, caching, or scaling — you need to know **which resource saturates first** on your specific system.

---

## Concept: Resource Limits as Hard Walls

**Date:** 2026-06-24

**The "Multiple Doors" mental model:**
A server is like a room with multiple doors, each with a different max capacity. The **smallest door** is your actual ceiling — doesn't matter how big the other doors are.

| Resource | What it is | What happens when full | Typical limit |
|----------|-----------|----------------------|---------------|
| **File descriptors** | OS handles for open files AND network connections | connection refused | 1,024 default, up to 65,535 |
| **Memory** | RAM used by your process (heap + stack) | OOM killer terminates process | Depends on server RAM |
| **CPU** | Processing power | ALL requests slow down, not just heavy ones | 100% across cores |
| **Disk I/O (IOPS)** | Read/write operations per second the disk can handle | Write latency spikes | SSD: 100K-500K reads |
| **Network ports** | Outbound connection endpoints | TIME_WAIT accumulation blocks new outbound connections | ~65K ports |

**Critical distinction:** CPU/memory saturation causes **gradual degradation** (everything gets slower). FD/port exhaustion causes **total failure** (new connections refused entirely). The second kind is harder to diagnose because the server "looks fine" on CPU/memory dashboards.

---

## Concept: Concurrency Models — How Servers Handle Multiple Users

**Date:** 2026-06-24
**Status:** Initial understanding — terms flagged for deep-dive below.

### Thread-per-connection (e.g., traditional Java, Python)
- Creates a **new thread** for each user connection
- Each thread costs ~1MB of memory
- Simple to code, but expensive in resources
- **First ceiling:** Memory (32GB / 1MB = ~32,000 max threads) or CPU from context switching

### Event loop (e.g., Node.js, nginx)
- **One thread** handles ALL connections by taking turns
- Each connection costs only ~KB of memory (very cheap)
- Can hold 100K+ connections on same hardware
- **First ceiling:** File descriptors (OS limit) or CPU if one request does heavy computation
- **Weakness:** Head-of-line blocking — one slow task blocks everyone behind it

### Why this matters
The concurrency model your server uses **changes which resource hits the ceiling first:**

| Model | Memory cost per connection | Max connections (32GB) | First bottleneck |
|-------|--------------------------|----------------------|-----------------|
| Thread-per-connection | ~1MB | ~32,000 | Memory / context switching |
| Event loop | ~few KB | ~100,000+ | File descriptors / CPU blocking |

---

## Terms Learned (Deep-Dive Complete)

All 12 terms explained with examples — 2026-06-24:

### 1. File Descriptor
A number the OS assigns to every open resource (file, connection, pipe). FD 0/1/2 = stdin/stdout/stderr. Each TCP connection = 1 FD. Default limit: 1,024 per process. When full → EMFILE → connection refused.
```
FD 0 → stdin (keyboard input)
FD 1 → stdout (console output)
FD 2 → stderr (error output)
FD 3 → your log file
FD 4 → user A's connection
FD 5 → user B's connection
...
FD 1024 → OS says "EMFILE — no more" ❌
```

### 2. Socket
One end of a network connection (like one phone in a phone call). Server creates a listening socket on a port; each client connection creates a new socket (and a new FD).
```
Server socket (listening):  0.0.0.0:8080
                               ↕
Client socket:             192.168.1.5:54321
```

### 3. TCP Connection
A 3-step handshake (SYN → SYN-ACK → ACK) before data flows. Reliable (both sides confirm), but slower than UDP.
```
You:     "Hi, I'd like to order" (SYN)
Barista: "Got it, I'm ready"     (SYN-ACK)
You:     "Great, here's my order" (ACK)  ← connection established
You:     "One latte please"       (data)
```

### 4. Keep-Alive
Reusing a TCP connection for multiple requests instead of handshaking each time. Faster, but idle keep-alive connections still consume FDs (this killed the startup).
```
Without: handshake→send→close, handshake→send→close (3 handshakes for 3 requests)
With:    handshake→send→send→send→close              (1 handshake for 3 requests)
Trap:    5,000 idle users = 5,000 FDs doing nothing
```

### 5. ulimit
Linux command that sets per-process resource limits. Default `ulimit -n` = 1,024 — dangerously low for servers.
```bash
$ ulimit -n        # check limit → 1024
$ ulimit -n 65535  # raise it (current session only!)
# Permanent: edit /etc/security/limits.conf — or it resets on reboot
```

### 6. Context Switching
CPU saving Thread A's state and loading Thread B's state. Takes ~1-10 microseconds each.
```
Chef analogy:
  2-3 dishes: switching is fine
  10,000 dishes: chef spends MORE time switching than cooking

  100 threads → barely noticeable
  10,000 threads → 10-30% CPU wasted on switching
  100,000 threads → system unusable
```

### 7. Event Loop
One thread checking "does anyone need attention?" in a loop. Node.js, nginx use this. Can hold 100K+ connections.
```
Hotel receptionist analogy:
  Loop forever:
    1. Any new guests?       → start check-in
    2. Any phone calls?      → answer phone
    3. Any room service?     → send order to kitchen (don't wait!)
    4. Any checkouts?        → process
    5. Back to step 1
  ONE receptionist, MANY guests. Never waits for the kitchen.
```

### 8. Thread-per-Connection
One dedicated thread per connection. Simple to code but each thread costs ~1MB RAM.
```
Restaurant analogy:
  Table 1 → Waiter 1 (stands there waiting for order)
  Table 2 → Waiter 2 (stands there waiting)
  Table 1000 → Waiter 1000 (you need 1000 waiters!)
  Each waiter does nothing while customer reads menu — but still costs space.
```

### 9. Head-of-Line Blocking
One slow item blocks everything behind it in a queue.
```
Drive-through analogy:
  Car A: "Custom cake" (10 min)
  Car B: "Just coffee"  (30 sec — but WAITS 10 min behind Car A)
  Car C: "A muffin"     (waits 10:30 behind both)

In event loop: one 50MB image compression blocks 5,000 waiting users.
Fix: offload heavy work to worker threads.
```

### 10. IOPS (Input/Output Operations Per Second)
How many read/write operations a disk can do per second. Trap: MB/s ≠ IOPS.
```
HDD: 100-200 random IOPS (disk head physically moves, ~5-10ms each)
SSD: 100,000-500,000 random IOPS (no moving parts, ~0.1ms each)

If you log every request at 10,000 RPS:
  HDD: need 10K IOPS, can do 200 → 50x over capacity ❌
  SSD: need 10K IOPS, can do 100K → fine ✓
```

### 11. TIME_WAIT
After closing a TCP connection, the port stays locked for 60-120 seconds to prevent data corruption.
```
1,000 outbound connections/sec × 60 sec cooldown = 60,000 ports in TIME_WAIT
Total ports available: ~65,000
→ Nearly out of ports even with plenty of CPU/memory!

Why it exists: prevents delayed packets from old connection corrupting new one.
```

### 12. OOM Killer
Linux forcibly kills the process using the most memory when RAM runs out. No warning, no graceful shutdown.
```
16GB system:
  PostgreSQL: 8GB, Your app: 6GB (leaking...), OS: 1.5GB
  Your app grows: 6→7→8→...→15.5GB
  OS: "0 bytes left. Killing your-app (PID 12345)"
  → No error in YOUR logs. Check dmesg or /var/log/kern.log.
  → All in-memory data lost instantly.
```

### 13. Thread
The smallest unit of work the CPU can schedule — one worker inside a process. All threads in a process share the same memory (heap), but each has its own stack (~1MB).
```
Process = An office (has its own room, furniture, files)
Thread  = A worker inside that office

All workers SHARE the same room and files (memory).
Each worker has their own desk (stack) and to-do list (program counter).
```

Why threads exist — without them, a process blocks on slow I/O:
```
Single-threaded:
  Request A → read disk (5ms wait) → respond
  Request B → BLOCKED until A finishes

Multi-threaded:
  Request A → Thread 1 reads disk
  Request B → Thread 2 handles immediately (while Thread 1 waits)
```

The trap — shared memory → race conditions:
```
Thread 1: read balance (100) → add 50  → write 150
Thread 2: read balance (100) → sub 20  → write 80
                                              ↑ Thread 2 overwrote Thread 1's work. $50 vanished.
```
This is why event loops avoid threads: one thread = zero race conditions.

### Context Switching vs Event Loop — Key Distinction
```
Context switching = the COST of having multiple threads (CPU overhead)
Event loop        = a STRATEGY to avoid that cost (single thread, no switching)

Thread-per-connection → pays the context switching tax
Event loop            → avoids it, but trades for head-of-line blocking vulnerability
```

### 14. Thread Pool
A fixed set of pre-created threads that pull work from a shared queue. Instead of creating/destroying threads per request, you reuse them. Resource bounding — "never use more than N threads."
```
Thread-per-connection: hire a new waiter per table, fire when done
  → 10,000 tables = 10,000 waiters = bankrupt

Thread pool: hire 20 waiters. Tables wait in the lobby.
  Waiter finishes → walks to lobby → "Next!" → serves next table
  If all busy → customers wait in line (queue)
  If line too long → "Sorry, full" (rejection policy)
```

Three decisions you must make:
```
1. Pool size (too few = queue builds up, too many = context switching returns)
   Formula: pool_size = num_cores × (1 + wait_time / compute_time)
   Example: 8 cores, 90ms DB wait, 10ms compute → 8 × 10 = 80 threads

2. Queue size (unbounded = OOM risk, bounded = need rejection policy)
   TRAP: Many frameworks default to unbounded queues!

3. Rejection policy (what happens when queue AND pool are full?)
   Abort → throw error, return 503 (usually best for HTTP)
   Caller-run → submitter runs it themselves (backpressure)
   Discard → silently drop (dangerous)
```

Real-world configs:
```
Java Tomcat:    maxThreads=200, queue=unbounded (!)
Go goroutines:  ~2KB each (vs 1MB), millions multiplexed on ~GOMAXPROCS OS threads
Node.js libuv:  UV_THREADPOOL_SIZE=4 (default!) — raise to 64-128 in production
Python:         ThreadPoolExecutor(max_workers=32)
```

Failure mode — all threads stuck on slow downstream:
```
200 threads × stuck 30 seconds = ALL blocked
Queue fills → rejects ALL new requests
Your service "down" even though YOUR code is fine
Fix: circuit breaker + per-service timeouts (Phase 11)
```

---

## Decision Point: Thread-per-Connection vs Event Loop vs Thread Pool

**Date:** 2026-06-25

### The Core Tension
Simplicity vs scalability — which failure mode can you tolerate: crashing from too many threads, or one slow request freezing everyone?

### Decision Matrix (Summary)
| | Thread-per-Connection | Event Loop | Thread Pool |
|---|---|---|---|
| Memory @10K conn | ~10GB | ~50MB | ~500MB |
| Max connections | 1K-10K | 10K-100K+ | 10K-50K |
| Failure mode | OOM + context switch death spiral | Head-of-line blocking | Queue overflow |
| Code complexity | Low | Medium | Medium-High |
| Debugging | Hard (race conditions) | Easy (single thread) | Medium |
| Who uses it | Apache httpd | Node.js, nginx, Redis | Java Tomcat, Go, Netty |

### The Thing People Forget
Tail latency — what happens when a request takes 100x longer than expected?
```
Thread-per-connection: one thread stuck, others fine ✓
Event loop: ALL connections freeze ✗
Thread pool: pool shrinks by 1, queue grows ⚠️
```

### Decision Heuristic
```
< 5K connections, simple code needed       → Thread-per-connection
> 10K connections, all I/O-bound           → Event loop
Mixed workload, need all CPU cores         → Thread pool
Production at scale                        → Hybrid (event loop + worker pool)
```

### What Seniors Argue About
Most production systems use hybrids:
- nginx: event loop for connections + worker processes for CPU work
- Node.js: event loop + worker_threads for heavy compute
- Go: goroutines (lightweight threads) + runtime scheduler
- Java Netty: event loop for I/O + thread pool for business logic

### My Choice for the Prototype
**Event Loop** — for HTTP API with 1K-10K users + file-backed storage.

**My reasoning:**
- Thread-per-connection could handle the user count, BUT shared file + multiple threads = race conditions requiring locks around every write, which serializes access anyway (defeating the purpose)
- Event loop gives sequential file access naturally — no locks, no races
- Simpler to debug: single thread = predictable execution order

**Gotcha I learned:** File I/O is blocking! In Node.js, libuv secretly offloads file reads/writes to a 4-thread pool under the hood. So even "event loop" systems use a hybrid — the event loop handles connections while a hidden thread pool handles blocking I/O. Pure event loop + raw file I/O = head-of-line blocking.

### Hybrid Model vs Thread Pool (Deep Comparison)

**Thread pool (standalone):** ALL work goes into a queue → N threads process everything (network read, file read, response — all blocking on each thread). Example: Java Tomcat with 50 threads.

**Hybrid:** Event loop handles network I/O directly (non-blocking) + a small thread pool ONLY for blocking operations (disk, DNS, crypto). Example: Node.js = 1 event loop + 4 libuv threads.

```
Thread pool alone: 50 threads to handle 50 connections. Each thread blocks on everything.
Hybrid (Node.js):  5 threads total to handle 100,000 connections.
  Why? 99% of work (network) doesn't need threads — OS does it async.
```

**Node.js internals:**
```
Event loop handles directly:     Thread pool handles:
  ✓ TCP connections               → fs.readFile / writeFile
  ✓ HTTP parse                    → DNS lookups (dns.lookup)
  ✓ JSON.parse                    → crypto (pbkdf2, scrypt)
  ✓ DB queries (via network)      → zlib compression
  ✓ setTimeout/setInterval        → some native addons
```

**The 4-thread trap:** Default UV_THREADPOOL_SIZE=4. If 4 file reads are in progress, a DNS lookup WAITS in the same queue. Your HTTP calls to external APIs timeout for no obvious reason. Fix: set UV_THREADPOOL_SIZE=64 before app starts.

**Key insight for shared file scenario:**
Both models serialize file access (event loop naturally, thread pool via mutex). But event loop holds 10K waiting connections cheaply (just FDs), while thread pool needs a thread per active connection (expensive). Event loop wins when the bottleneck serializes anyway.

**When thread pool WOULD win:** If each user had their OWN file (no shared state, no lock needed) — 50 threads could read 50 different files in parallel. Event loop's 4-thread libuv pool would be slower.

### Thread Pool Standalone — How It Works for This Scenario

Thread pool with shared file: each thread blocks on everything (network read, file read, response send). Must add mutex around file access.
```
Thread #14: accept conn → read HTTP (blocks) → acquire fileLock (may wait)
            → read file (blocks) → modify → write file (blocks)
            → release fileLock → send response (blocks) → back to pool
```

The irony: mutex serializes file access anyway. You get network concurrency (multiple threads reading HTTP requests simultaneously) but sequential disk access — same as event loop gives naturally.

```
Thread pool: 50 threads × 1MB = 50MB RAM for 50 concurrent connections
Event loop:  5 threads total = ~5MB RAM for 100K connections
Both serialize file access. Event loop is cheaper for the same bottleneck.
```

Thread pool wins ONLY when there's no shared state (e.g., each user has own file → no lock → true parallelism on 50 files at once).

---

## Build Phase

**Prototype Spec:** [phase-01-spec.md](../prototypes/phase-01-spec.md)

**Stack:** Node.js (raw `http` module, zero npm packages)

### What We Built

HTTP key-value store with resource monitoring:
- `GET /data/:key` — read from JSON file
- `PUT /data/:key` — write to JSON file (full read-modify-write cycle)
- `GET /stats` — live metrics (memory, active handles, connections, event loop lag)
- `GET /heavy` — deliberate CPU blocker (5s while loop) for testing

### Key Implementation Insights

**1. Event loop lag measurement requires async response:**
```js
// WRONG: setTimeout returns Timer object, not the lag value
const lag = setTimeout(() => { Date.now() - start }, 0);
res.end(lag); // sends Timer object!

// RIGHT: send response FROM INSIDE the callback
setTimeout(() => {
    const lag = Date.now() - start;
    res.end(JSON.stringify({ event_loop_lag_ms: lag }));
}, 0);
```
Lesson: `res.end()` can be called anytime before connection closes — it's async-friendly.

**2. `res.writeHead()` can only be called once per response:**
Use `res.setHeader()` for defaults, then `writeHead()` only when you need a different status code (404, 405).

**3. Active handles vs active connections:**
- `process._getActiveHandles()` — counts ALL libuv handles (sockets, timers, pipes, server)
- Manual `activeConnections` counter via `server.on('connection')` — tracks only TCP clients

**4. File store needs ENOENT handling:**
First request ever → file doesn't exist → return `{}` instead of crashing.

---

## Failure Lab

### Experiment 1: Connection Flood → ENOBUFS at 15,965 connections

**What happened:** Opened TCP connections without closing them. Server stayed alive but OS kernel ran out of network buffer space.

```
15,965 connections × ~16KB kernel buffers = ~250MB non-paged pool memory
Error: ENOBUFS (no buffer space available)
```

**Ceiling hierarchy discovered:**
```
Event loop: fine (0% CPU, just holding FDs)
Node.js heap: fine (~480MB, within V8 limits)
OS kernel network buffers: EXHAUSTED ← the actual ceiling
FD limit (~16K on Windows): almost reached
```

**Key insight:** The ceiling was the OS kernel, not our code. No amount of better application code fixes this on a single machine.

### Experiment 2: CPU Blocking → All requests frozen

**What happened:** `/heavy` runs a synchronous 5-second while loop. During that time, `/stats` (which should take 1ms) also takes 5 seconds.

```
while(Date.now() - start < 5000) {}  // blocks ENTIRE event loop
```

**Why:** Synchronous code between awaits is uninterruptible. The event loop cannot process ANY callbacks until the while loop finishes.

**Production causes of this:** JSON.parse on huge payloads, ReDoS (regex denial of service), fs.readFileSync(), crypto without async APIs.

### Experiment 3: Write Race Condition

**What happened:** 100 concurrent PUTs with overwrite → last writer wins (got 100). But with read-modify-write patterns, data loss occurs.

**The race mechanism:**
```
Request A: await readStore() → gets {counter: 1}    ← yields
Request B: await readStore() → gets {counter: 1}    ← STALE (A hasn't written yet)
Request A: store.counter = 2 → await writeStore()   ← writes {counter: 2}
Request B: store.counter = 2 → await writeStore()   ← OVERWRITES with {counter: 2}
                                                       (should be 3!)
```

**Key insight:** Event loop doesn't prevent race conditions — it makes them *less frequent*. Code between `await`s is atomic, but the full async function is NOT atomic. Every `await` is a yield point where another request can interleave.

**Comparison:**
- Threads: race at ANY CPU instruction (OS preempts anytime)
- Event loop: race ONLY at `await`/callback boundaries

---

## Gate Check

**Result: PASS**

### Scenario 1: 2am alert, 12s response times, CPU 98%, event loop lag 12,000ms
- **Diagnosis:** CPU-blocking synchronous operation on the event loop (correct)
- **First action to confirm:** CPU profile (`--prof`), check access logs for unusual payloads, check recent deployments
- **Immediate mitigation:** Restart process (buys time), then investigate root cause

### Scenario 2: Flash sale, wrong order quantities, read-modify-write race
- **Root cause:** At high traffic, multiple requests overlap at `await` boundaries — they read stale state before prior writes complete
- **Why only high traffic:** At low traffic, requests complete sequentially (no overlap at await points)
- **Minimal fix (no DB):** Promise-based write queue that serializes operations:
```js
let writeLock = Promise.resolve();
async function putHandler(key, value) {
    writeLock = writeLock.then(async () => {
        const store = await readStore();
        store[key] = value;
        await writeStore(store);
    });
    await writeLock;
}
```

### Scenario 3: "15K connections is enough, why scale?"
Two reasons this reasoning is dangerous:
1. **Connections ≠ the only ceiling.** One CPU-heavy request freezes all 15K users. Disk I/O becomes bottleneck as data grows. The ceiling you hit next isn't the one you're measuring.
2. **Single machine = single point of failure.** Hardware fails, deploys require downtime (restart = all users disconnected), crashes lose in-flight writes. "Enough capacity" ≠ "enough reliability."

---

## Progress

- [x] Motivation (war story)
- [x] Concept A: Resource limits as hard walls
- [x] Concept B: Concurrency models (initial pass — needs deeper study)
- [x] Concept B: Deep-dive on all 12 terms + thread concept (complete)
- [x] Decision Point: thread-per-connection vs event-loop vs thread-pool
- [x] Build: HTTP service with file-backed storage + resource monitoring
- [x] Break-It: Connection flood, CPU blocking, write race
- [x] Gate Check: PASS
