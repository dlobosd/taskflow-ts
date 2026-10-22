import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadTasks, saveTasks } from '../src/store.ts';
test('round trip and corrupt input preservation', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'taskflow-'));
  const path = join(dir, 'tasks.json');
  try {
    assert.deepEqual(await loadTasks(path), []);
    const tasks = [{ id: 1, title: 'Revisar PR', done: false }];
    await saveTasks(path, tasks);
    assert.deepEqual(await loadTasks(path), tasks);
    await writeFile(path, 'broken');
    await assert.rejects(loadTasks(path));
    assert.equal(await readFile(path, 'utf8'), 'broken');
  } finally { await rm(dir, { recursive: true, force: true }); }
});
