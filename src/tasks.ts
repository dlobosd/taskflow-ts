export type Task = { id: number; title: string; done: boolean };
export function validateTasks(value: unknown): asserts value is Task[] {
  if (!Array.isArray(value)) throw new Error('Se esperaba una lista de tareas.');
  const ids = new Set<number>();
  for (const t of value) {
    if (!t || !Number.isSafeInteger(t.id) || t.id < 1 || typeof t.title !== 'string' || !t.title.trim() || typeof t.done !== 'boolean' || ids.has(t.id))
      throw new Error('Tareas inválidas o IDs duplicados.');
    ids.add(t.id);
  }
}
export function addTask(tasks: Task[], title: string): Task[] {
  title = title.trim();
  if (!title) throw new Error('El título no puede estar vacío.');
  const id = Math.max(0, ...tasks.map(t => t.id)) + 1;
  if (!Number.isSafeInteger(id)) throw new Error('Se agotaron los IDs.');
  return [...tasks, { id, title, done: false }];
}
export function completeTask(tasks: Task[], id: number): Task[] {
  if (!tasks.some(t => t.id === id)) throw new Error('No existe esa tarea.');
  return tasks.map(t => t.id === id ? { ...t, done: true } : t);
}

export type TaskStatus = 'all' | 'pending' | 'done';
export function filterTasks(tasks: Task[], status: TaskStatus = 'all', query = ''): Task[] {
  if (!['all', 'pending', 'done'].includes(status)) throw new Error('Estado inválido.');
  const search = query.trim().toLocaleLowerCase('es');
  return tasks.filter(t =>
    (status === 'all' || t.done === (status === 'done')) &&
    t.title.toLocaleLowerCase('es').includes(search));
}
