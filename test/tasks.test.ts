import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addTask, completeTask, validateTasks } from '../src/tasks.ts';
test('add trims title, allocates ID and preserves input', () => {
  const tasks = [{ id: 3, title: 'a', done: false }];
  assert.deepEqual(addTask(tasks, ' b ')[1], { id: 4, title: 'b', done: false });
  assert.equal(tasks.length, 1);
  assert.throws(() => addTask([], ' '));
});
test('completion is immutable and rejects missing IDs', () => {
  const tasks = addTask([], 'a');
  assert.equal(completeTask(tasks, 1)[0]!.done, true);
  assert.equal(tasks[0]!.done, false);
  assert.throws(() => completeTask(tasks, 2));
});
test('validation rejects corrupt data and duplicate IDs', () => {
  for (const data of [null, {}, [{ id: -1 }], [{ id: 1, title: ' ', done: false }], [{ id: 1, title: 'a', done: false }, { id: 1, title: 'b', done: true }]]) assert.throws(() => validateTasks(data));
  validateTasks([]);
});
