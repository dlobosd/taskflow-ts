import { resolve } from 'node:path';
import { addTask, completeTask } from './tasks.ts';
import { loadTasks, saveTasks } from './store.ts';
const help = 'Uso: npm start -- add "Título" | list | done ID | help';
async function main(): Promise<void> {
  const [command = 'help', ...args] = process.argv.slice(2);
  if (command === 'help') { console.log(help); return; }
  if (!['add', 'list', 'done'].includes(command)) throw new Error(help);
  if (command === 'list' && args.length) throw new Error('list no recibe argumentos.');
  const path = resolve(process.env.TASKFLOW_FILE || '.taskflow.json');
  const tasks = await loadTasks(path);
  if (command === 'list') {
    console.log(tasks.length ? tasks.map(t => (t.done ? '[x] ' : '[ ] ') + t.id + ': ' + t.title).join('\n') : 'Todavía no hay tareas.');
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
