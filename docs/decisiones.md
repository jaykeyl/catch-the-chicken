# Decisiones técnicas

## React

React representa el escenario del juego y sus elementos principales:

* jugadores;
* gallinas;
* marcador;
* tiempo;
* instrucciones;
* mensajes;
* pantalla de finalización.

El frontend utiliza `fetch` para comunicarse con la API de Express.

El movimiento de los jugadores se representa localmente de forma inmediata para evitar que la latencia de red afecte la jugabilidad.

## Movimiento y sincronización

Se utiliza una combinación de movimiento visual inmediato y validación mediante backend.

Cuando se mantiene una tecla presionada, React actualiza inmediatamente la posición visual del jugador y, en paralelo, envía el movimiento a Express.

El servidor valida cada movimiento y mantiene su propio estado de la partida.

El polling periódico de `GET /api/game` actualiza información como:

* tiempo;
* puntuación;
* energía;
* capturas;
* gallinas;
* mensajes;
* estado de la partida.

Las posiciones visuales de los jugadores no son reemplazadas directamente por cada respuesta del polling, evitando pequeños saltos o retrocesos provocados por la latencia de red.

## Express

Express administra el estado crítico de la partida:

* crea y reinicia partidas;
* valida movimientos;
* controla los límites del mapa;
* descuenta energía por movimiento;
* actualiza la simulación de las gallinas;
* valida capturas;
* calcula puntuaciones;
* actualiza energía;
* genera nuevas gallinas;
* determina el ganador;
* controla la finalización por tiempo.

De esta forma, las reglas importantes no dependen únicamente del cliente.

## Sin motor de juegos

No se utiliza un motor de juegos externo.

La lógica de movimiento, distancia, límites, puntuación y simulación de las gallinas se implementa directamente con TypeScript.

Esto permite explicar la lógica durante la defensa y mantiene la arquitectura sencilla.

## Sin librería de UI

Los estilos se implementan mediante CSS propio.

No se utiliza una librería externa de componentes para la interfaz.

## Estado en memoria

Para el alcance académico se utiliza memoria del proceso de Node.js.

Esto simplifica la arquitectura y permite demostrar claramente la participación del backend.

En una aplicación multiusuario real con múltiples instancias del servidor sería necesario utilizar almacenamiento compartido o una base de datos.

## Dos jugadores en el mismo dispositivo

El juego está diseñado para dos jugadores locales que utilizan el mismo navegador y teclado.

* Rojo: W, A, S, D.
* Azul: flechas.

Las acciones de captura utilizan:

* Rojo: ESPACIO.
* Azul: ENTER.

## Variabilidad

Las gallinas se generan con características variables.

Su posición, tipo, dirección y velocidad inicial dependen de valores aleatorios.

Los tipos disponibles son:

* normal;
* rápida;
* dorada;
* tramposa.

Esto evita que todas las partidas tengan exactamente el mismo comportamiento.

## Actualización periódica del servidor

El servidor ejecuta periódicamente la simulación mediante `tick()`.

Esto permite que el tiempo y el movimiento de las gallinas continúen avanzando aunque en ese instante no exista una petición del frontend.

## Producción

En producción, Express sirve el frontend compilado desde `server/public` y también expone la API.

Esto permite utilizar un único servicio web y un mismo dominio para frontend y backend.
