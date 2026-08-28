# 01 — Async Task Runner

## Problem

Implement:

```js
const results = await runTasks(tasks);
```

A **task** is a function that takes no arguments and returns a Promise (i.e. an
`async` function). When called it starts some asynchronous work — an HTTP
request, a timer, a file read — and eventually either resolves with a value or
rejects with an error. Tasks take varying amounts of time.

`runTasks` calls every task, waits for all of them to settle, and returns an
array describing the outcome of each one.

You are effectively re-implementing `Promise.allSettled`. Do not call it — that
is the thing you are building. `Promise.all` is not enough, because it rejects as
soon as one task rejects.

## Success criteria

- Every task in `tasks` is called.
- The returned array has exactly one entry per task, **in the same order as the
  input array** — not the order the tasks finished in.
- Each entry records whether that task succeeded or failed, and carries either
  the resolved value or the rejection reason.
- A rejected task never prevents the other tasks from running or from appearing
  in the results.
- The Promise returned by `runTasks` *resolves* even when some tasks reject; it
  only rejects if `runTasks` itself is misused.
- `runTasks([])` resolves to `[]`.

## Result entry shape

```js
{ status: 'fulfilled', value: <resolved value> }
{ status: 'rejected',  value: <rejection reason> }
```

Deliberately using `value` for both branches rather than `allSettled`'s
`value` / `reason` split — the `status` field already says which one it is, and a
single key is simpler to destructure. `status` is decided by *how the task
settled*, never by the type of the value, so a task that resolves to `undefined`
or to an `Error` object is still `fulfilled`.

## Property suite

`index.test.js` — one integration test plus focused tests, each named for the
rule it proves:

- **settles every task and reports each outcome in order** — mixed array (slow,
  fast, throw, reject, resolve-undefined) with the slow task first; asserts the
  full result array, proving ordering, isolation, both statuses, and that
  `undefined` / `Error` values stay `fulfilled`.
- **`runTasks([])` resolves to `[]`**
- **every task is invoked exactly once** — tasks wrapped in call counters
- **resolves rather than rejects when every task rejects**
- **tasks run concurrently, not sequentially** — N tasks of duration D finish in
  ~D wall-clock, not ~N·D
