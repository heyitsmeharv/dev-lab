import { expect, test } from 'vitest';
import { runTasks } from './index.js';

const tasks = [
  () => new Promise(r => setTimeout(() => r('slow'), 50)),
  () => Promise.resolve('fast'),
  async () => { throw new Error('boom') },
  () => Promise.reject('nope'),
  () => Promise.resolve(undefined)
];

test('settles every task and reports each outcome in order', async () => {
  expect(await runTasks(tasks)).toEqual([
    {
      "status": "fulfilled",
      "value": "slow",
    },
    {
      "status": "fulfilled",
      "value": "fast",
    },
    {
      "status": "rejected",
      "value": new Error("boom")
    },
    {
      "status": "rejected",
      "value": "nope",
    },
    {
      "status": "fulfilled",
      "value": undefined,
    },
  ]);
});