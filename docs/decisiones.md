# Decisiones técnicas

## React

React representa el escenario, jugadores, gallinas, marcador, mensajes y pantalla de finalización.

El estado visual se sincroniza con la API usando `fetch`.

## Express

Express administra el estado crítico de la partida:

- crea partidas;
- mueve jugadores;
- valida energía y límites;
- mueve las gallinas;
- valida capturas;
- calcula puntuación;
- decide el ganador;
- genera nuevas gallinas.

## Sin motor de juegos

La lógica de movimiento y colisiones se implementa directamente con TypeScript para que el estudiante pueda explicar cómo funciona.

## Sin librería de UI

Los estilos se implementan con CSS propio.

## Estado en memoria

Para el alcance académico se utiliza memoria del proceso. Esto simplifica la arquitectura. En una aplicación multiusuario real se debería utilizar almacenamiento compartido.

## Variabilidad

La posición, tipo, dirección y velocidad inicial de las gallinas son aleatorios.
