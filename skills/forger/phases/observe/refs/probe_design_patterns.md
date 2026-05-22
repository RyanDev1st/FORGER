# Probe Design Patterns (OBSERVE phase)

A probe is the smallest executable test that can **falsify** an
assumption. The OBSERVE phase runs one probe per high/critical
assumption via `src/cli/probe.mjs`. The tool accepts exactly six probe
types:

  `script | repo_clone | web_search | prototype_fn | benchmark | api_test`

This file is one section per type. Each section gives the **command
shape** (what `--cmd` should look like), the **evidence to capture**
(what makes the probe pass or fail), and the **common pitfalls** that
make a probe either lie to you or fail for the wrong reason.

The tool invocation is always:

  `node src/cli/probe.mjs --workspace <path> --assumption-id <asm-id> --type <type> --cmd "<command>" [--timeout-ms <N>]`

The tool runs `<command>` inside a per-assumption sandbox at
`workspaces/{slug}/probe-sandbox/{asm-id}/`, captures stdout and
stderr, and appends one `probe_result` entry to
`workspaces/{slug}/probe_results.jsonl`. Exit code 0 means the
assumption survives; non-zero means the assumption was falsified.

The cheapest probe that can falsify the assumption is the right
probe. A probe that takes ten minutes to build but never could fail
is worse than no probe at all.

---

## 1. `script`

**When to use.** The assumption can be tested by running a small
purpose-written shell or language script that exits 0 only when the
assumption holds. Best for "the tool does what its docs say" claims,
deterministic CLI behavior, and self-contained format checks.

**Command shape.**

  `--type script --cmd "bash -c 'set -e; ./probe.sh && grep -q FOUND output.txt'"`

The command sequence ends with an assertion (`grep -q`, `test`,
`[[ ... ]]`, a language-native exit code) that returns non-zero on
falsification. Sandbox files live alongside; reference them with
relative paths inside the `--cmd` string.

**Evidence to capture.** The probe runner captures stdout and stderr
automatically. Make your script print a one-line summary of what it
checked just before the asserting `grep` — the captured stdout
becomes the human-readable evidence the next reviewer sees.

**Common pitfalls.**

- Forgetting `set -e` — a failure in step 2 of a 3-step pipeline gets
  masked by a successful step 3.
- Asserting on output that requires network — drift in upstream
  changes the probe outcome without changing the assumption.
- Using ambient state from `$HOME` or `$PWD` outside the sandbox —
  the next run gets different inputs.
- Echoing the expected value into the assertion (`echo FOUND > output;
  grep -q FOUND output`) — this passes vacuously.

## 2. `repo_clone`

**When to use.** The assumption can be falsified by cloning a real
project, building or running it under stated conditions, and observing
the output. Best for "library X has working integration with Y" or
"this canonical repo demonstrates pattern Z" claims.

**Command shape.**

  `--type repo_clone --cmd "git clone --depth 1 https://github.com/org/repo . && npm ci --omit=dev && node -e 'require(\"./dist\").doThing()' | grep -q EXPECTED"`

The `--depth 1` keeps the clone fast; `npm ci --omit=dev` keeps
install reproducible. The asserting tail belongs at the end of the
chain.

**Evidence to capture.** The captured stdout includes the build logs
and the assertion output. If a build dominates the captured tail,
filter the build noise with `2>&1 | tail -n 50` to keep the meaningful
output visible.

**Common pitfalls.**

- Cloning `main` without a pinned SHA — the upstream changes, the
  probe drifts. Pin with `git checkout <sha>` after clone for any
  probe you intend to re-run later.
- Network or rate-limit failures look identical to falsification.
  Always inspect the stderr for HTTP errors before concluding the
  assumption is wrong.
- A repo that needs credentials cannot run in the sandbox; classify
  as `cost-prohibitive` and waive (standard/quick) or escalate (deep).
- Timeouts — large repos exceed the default 60s. Pass
  `--timeout-ms 600000` for any repo you expect to take minutes.

## 3. `web_search`

**When to use.** The assumption is about *whether evidence exists* in
the public web (e.g., "no public exploit has been published for CVE
X"; "vendor Y has not announced deprecation"). Best for negative
evidence checks where the absence of a credible source is the signal.

**Command shape.**

  `--type web_search --cmd "curl -sS 'https://api.duckduckgo.com/?q=<query>&format=json' | jq -r '.RelatedTopics[].Text' | grep -i -q '<expected term>'"`

A `web_search` probe is still a shell command — the tool does not
spawn a browser. Pipe the JSON / HTML through `jq` or `grep`, ending
in an assertion.

**Evidence to capture.** The captured stdout should include the
underlying search response (or a `head -n 50` of it) so the next
reviewer can see what *did* return, not only that the expected term
was absent.

**Common pitfalls.**

- Search APIs cap results and return personalized rankings; *absence*
  in the top results is weak evidence of absence on the web. Use this
  probe only when the negative claim is narrow enough to expect a
  direct hit (e.g., a specific CVE id, a specific deprecation
  announcement).
- A 429 (rate-limited) or 5xx response is not evidence either way;
  the probe should re-try once with a backoff, then waive if it still
  fails.
- Search results drift; pin the query precisely and record the query
  in the assumption's `description` so a re-run is replicable.

## 4. `prototype_fn`

**When to use.** The assumption can be falsified by implementing the
**smallest possible version** of the proposed function and observing
its behavior on a stated input. Best for "the proposed API surface is
sufficient" claims and "this transformation preserves invariant X"
claims.

**Command shape.**

  `--type prototype_fn --cmd "node -e 'function f(x){ /* minimal impl */ } const out = f(<input>); if (out !== <expected>) process.exit(1)'"`

The implementation lives inline in the `-e` string for one-shot
probes, or in a `proto.mjs` file in the sandbox for anything beyond
~20 lines. Either way the final exit code is the assertion.

**Evidence to capture.** Print both the input and the actual output
before the exit-code assertion, so the captured stdout reads as a
short trace: input X, output Y, expected Z, pass/fail.

**Common pitfalls.**

- Mocking the dependencies the assumption is about — a prototype that
  fakes the database has not tested whether the database behaves as
  assumed.
- Testing the happy path only; the assumption is usually about an
  edge case, so the probe input should be the edge case.
- Building a prototype so complete it becomes the real implementation
  — the prototype is throwaway, the goal is falsification, not a
  finished feature. Spend less than thirty minutes on the smallest
  version.

## 5. `benchmark`

**When to use.** The assumption is a quantitative claim about
performance (latency, throughput, memory, allocation count). Best for
`success_criteria_measurable[]`-derived assumptions where the
threshold is the falsification line.

**Command shape.**

  `--type benchmark --cmd "node bench.mjs --iterations 1000 | tee bench.out && node -e 'const r = require(\"./bench.out.json\"); if (r.p99 > 50) process.exit(1)'"`

Two stages: run the benchmark, then assert the result against the
threshold. The threshold belongs in the assertion code, not in the
benchmark itself, so a borderline pass is visible in the captured
output.

**Evidence to capture.** The full `bench.out` (or its
percentile-summary view) — the next reviewer needs to see the
distribution, not just the pass/fail bit. Capture mean, p50, p95,
p99, and one sample raw value.

**Common pitfalls.**

- Single-iteration benchmarks lie. Aim for at least 1000 iterations,
  warm up before measuring, and report percentiles not means.
- Comparing to a hard-coded threshold from a different environment
  (CI vs. dev laptop) — the assumption usually carries an implicit
  environment. State it in the assumption `description`.
- Confusing latency-with-network for latency-without-network — pin
  whether the probe is testing the artifact's overhead or the round
  trip including its dependencies.
- Garbage collection pauses skewing tail latencies; report p99
  alongside p99.9 if the assumption is about worst-case behavior.

## 6. `api_test`

**When to use.** The assumption is about the behavior of a live
external API: response shape, rate limits, authentication flow,
documented vs. observed semantics. Best for "the API really does
return field X" or "the API enforces rule Y" claims.

**Command shape.**

  `--type api_test --cmd "curl -sS -H 'Accept: application/json' 'https://api.example.com/v1/thing/123' | jq -e '.field == \"expected\"'"`

`jq -e` is the simplest reliable assertion for JSON APIs (exit 0 if
the expression is truthy, non-zero otherwise). For non-JSON APIs,
substitute `grep -q` or `xmllint --xpath`.

**Evidence to capture.** The raw response body (or its first 200
lines) and the status code line. If the API uses pagination, capture
the first page; mention in the assumption description that the probe
is testing page 1 only.

**Common pitfalls.**

- Hitting a production endpoint without rate-limit awareness — get
  blocked, the probe lies. Prefer the API's documented test or
  sandbox host where one exists.
- Credentials in the command line — visible in process tables and in
  `probe_results.jsonl`. Use `--cmd 'curl ... -H "Authorization:
  Bearer $TOKEN"'` with `$TOKEN` set in the environment outside the
  command string, or skip the probe and waive when the assumption
  cannot be tested without a real key.
- A 200 OK with an empty body still exits 0 from `curl`; the
  assertion must check the body, not the transport.
- The API behaves differently for the first call after a long idle
  (cold start). Run twice and capture both if the assumption is
  steady-state.
