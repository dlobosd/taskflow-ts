# TaskFlow TS

Gestor de tareas local por terminal, escrito en TypeScript. Sin dependencias de ejecución.

## Uso

Requiere Node.js 24 o superior. No hace falta instalar paquetes.

```sh
npm start -- add "Preparar entrega"
npm start -- list
npm start -- list pending "entrega"
npm start -- list done
npm start -- done 1
npm test
```

Las tareas se guardan en `.taskflow.json` en el directorio actual. La variable de entorno `TASKFLOW_FILE` permite elegir otro archivo.

## Diseño

- Operaciones puras e inmutables en `src/tasks.ts`.
- Validación de datos antes de usarlos; archivos corruptos se rechazan sin sobrescribirlos.
- Guardado con archivo temporal y renombrado.
- Errores de uso devuelven un código de salida distinto de cero.
- Pruebas con el runner integrado de Node.

Ejecutar un solo proceso a la vez: todavía no hay bloqueo entre procesos concurrentes.
Node ejecuta TypeScript directamente, sin comprobación estática de tipos.

Podés filtrar con `all`, `pending` o `done` y agregar un texto de búsqueda. La búsqueda ignora mayúsculas y minúsculas.

Próxima mejora: estadísticas de avance.
