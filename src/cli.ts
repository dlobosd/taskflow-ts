import { resolve } from 'node:path';
import { addTask, completeTask, filterTasks } from './tasks.ts';
import { loadTasks, saveTasks } from './store.ts';
import { summarizeTasks } from './stats.ts';
const help = 'Uso: npm start -- add "Título" | list [all|pending|done] [búsqueda] | done ID | stats | help';
async function main(): Promise<void> {
  const [command = 'help', ...args] = process.argv.slice(2);
  if (command === 'help') { console.log(help); return; }
  if (!['add', 'list', 'done', 'stats'].includes(command)) throw new Error(help);
  if (command === 'list' && args[0] && !['all', 'pending', 'done'].includes(args[0])) throw new Error('Usá all, pending o done.');
  if (command === 'stats' && args.length) throw new Error('stats no recibe argumentos.');
  const path = resolve(process.env.TASKFLOW_FILE || '.taskflow.json');
  const tasks = await loadTasks(path);
  if (command === 'stats') {
    const stats = summarizeTasks(tasks);
    console.log('Total: ' + stats.total + '\nCompletadas: ' + stats.done + '\nPendientes: ' + stats.pending + '\nAvance: ' + stats.percent + '%');
  } else if (command === 'list') {
    const filtered = filterTasks(tasks, (args[0] || 'all') as 'all' | 'pending' | 'done', args.slice(1).join(' '));
    console.log(filtered.length ? filtered.map(t => (t.done ? '[x] ' : '[ ] ') + t.id + ': ' + t.title).join('\n') : 'No hay tareas que coincidan.');
  } else if (command === 'add') {
    await saveTasks(path, addTask(tasks, args.join(' ')));
    console.log('Tarea creada.');
  } else {
    if (args.length !== 1 || !/^[1-9]\d*$/.test(args[0]!) || !Number.isSafeInteger(Number(args[0]))) throw new Error('Usá un ID entero positivo.');
    await saveTasks(path, completeTask(tasks, Number(args[0])));
    console.log('Tarea completada.');
  }
}
main().catch(e => { console.error('Error: ' + e.message); process.exitCode = 1; });
