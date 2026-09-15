# Registro de uso de IA

La IA fue utilizada como asistente durante el desarrollo del proyecto.

## Solicitudes relevantes

Entre las tareas realizadas con ayuda de IA estuvieron:

* proponer una arquitectura React + TypeScript y Express + TypeScript;
* generar una primera implementación de la lógica del juego;
* revisar y mejorar la comunicación entre frontend y backend;
* proponer una estrategia de movimiento visual inmediato para reducir la sensación de latencia;
* revisar la sincronización entre el estado local y el estado del servidor;
* proponer y revisar pruebas E2E con Playwright;
* solucionar problemas relacionados con el foco del teclado y los selectores de las pruebas;
* proponer workflows de GitHub Actions;
* revisar la configuración de publicación en Render;
* revisar la configuración de `render.yaml` y del Deploy Hook;
* revisar y mejorar la documentación técnica.

## Uso de la IA durante la implementación

La IA se utilizó como apoyo para analizar problemas, proponer alternativas y revisar código.

Las decisiones finales fueron revisadas y aplicadas dentro del proyecto por el estudiante.

En particular, el movimiento de los jugadores fue revisado para evitar que las respuestas del servidor provocaran pequeños saltos visuales. La solución final mantiene una posición visual inmediata en el frontend mientras Express continúa validando los movimientos.

## Verificación realizada por mi (estudiante)

Verifique el funcionamiento mediante:

* ejecución local de la aplicación;
* revisión de los endpoints JSON;
* pruebas de movimiento;
* pruebas de captura;
* comprobación de puntuación y energía;
* comprobación de finalización de partida;
* ejecución de pruebas E2E con Playwright;
* ejecución de Playwright en modo visual mediante Chrome;
* revisión de los workflows de GitHub Actions;
* revisión de la configuración de Render;
* revisión de la comunicación entre React y Express.
