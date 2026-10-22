import { readFile, writeFile, rename, rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { validateTasks } from './tasks.ts';
import type { Task } from './tasks.ts';
export async function loadTasks(path: string): Promise<Task[]> {
  let text: string;
  try { text = await readFile(path, 'utf8'); }
  catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw e;
  }
  const data: unknown = JSON.parse(text);
  validateTasks(data);
  return data;
}
export async function saveTasks(path: string, tasks: Task[]): Promise<void> {
  validateTasks(tasks);
  const temp = path + '.' + randomUUID() + '.tmp';
  try {
    await writeFile(temp, JSON.stringify(tasks, null, 2) + '\n', { mode: 0o600 });
    await rename(temp, path);
  } finally { await rm(temp, { force: true }); }
}
