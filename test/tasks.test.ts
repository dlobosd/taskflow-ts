import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addTask, completeTask, validateTasks, filterTasks } from '../src/tasks.ts';
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

test('filters by status and case-insensitive title without mutation', () => {
  const tasks = [{ id: 1, title: 'Revisar PR', done: false }, { id: 2, title: 'Publicar', done: true }];
  assert.deepEqual(filterTasks(tasks, 'pending', 'REVISAR'), [tasks[0]]);
  assert.deepEqual(filterTasks(tasks, 'done'), [tasks[1]]);
  assert.deepEqual(filterTasks(tasks, 'all', 'inexistente'), []);
  assert.equal(filterTasks(tasks).length, 2);
  assert.equal(tasks.length, 2);
});
