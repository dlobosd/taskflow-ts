import type { Task } from './tasks.ts';

export function summarizeTasks(tasks: readonly Task[]) {
  const total = tasks.length;
  const done = tasks.filter(task => task.done).length;
  return { total, done, pending: total - done, percent: total ? Math.round(done / total * 100) : 0 };
}
