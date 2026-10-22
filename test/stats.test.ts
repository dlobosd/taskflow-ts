import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeTasks } from '../src/stats.ts';
test('empty lists report zero progress', () => {
  assert.deepEqual(summarizeTasks([]), { total: 0, done: 0, pending: 0, percent: 0 });
});
test('mixed lists report rounded progress without mutation', () => {
  const tasks = Object.freeze([
    Object.freeze({ id: 1, title: 'a', done: true }),
    Object.freeze({ id: 2, title: 'b', done: false }),
    Object.freeze({ id: 3, title: 'c', done: false })
  ]);
  assert.deepEqual(summarizeTasks(tasks), { total: 3, done: 1, pending: 2, percent: 33 });
  assert.deepEqual(summarizeTasks(tasks.slice(0, 1)), { total: 1, done: 1, pending: 0, percent: 100 });
});
