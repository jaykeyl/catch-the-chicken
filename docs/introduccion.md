# Introducción

## Nombre

**Catch the Chicken!**

## Propósito

Catch the Chicken! es un juego web competitivo para dos jugadores que comparten el mismo navegador y teclado.

Los jugadores recorren una granja mientras persiguen gallinas que se desplazan automáticamente por el escenario.

El objetivo es conseguir **20 puntos antes que el rival**.

La experiencia combina movimiento, captura de recursos, gestión de energía, riesgo y decisiones sobre qué gallina perseguir.

## Tipo de jugadores

Hay exactamente dos jugadores en el mismo navegador/dispositivo.

### Jugador Rojo

* Movimiento: W, A, S, D.
* Captura: ESPACIO.

### Jugador Azul

* Movimiento: flechas del teclado.
* Captura: ENTER.

## Flujo de una partida

1. Se inicia una partida.
2. Express genera el estado inicial y las gallinas.
3. Cada jugador se mueve por el campo.
4. El movimiento se muestra inmediatamente en el navegador.
5. Los movimientos se envían a Express para su validación.
6. Las gallinas cambian de posición automáticamente.
7. Los jugadores buscan gallinas de diferentes valores.
8. Un jugador intenta capturar una gallina cuando está suficientemente cerca.
9. Express valida la distancia y procesa la captura.
10. La puntuación y la energía se actualizan.
11. Se genera una nueva gallina después de una captura válida.
12. El primer jugador en alcanzar 20 puntos gana.
13. Si el tiempo llega a cero antes de alcanzar el objetivo, gana quien tenga más puntos.
14. Si ambos jugadores tienen la misma puntuación cuando termina el tiempo, la partida termina en empate.

## Participación del backend

El backend participa activamente en la partida.

Express mantiene y valida:

* posiciones;
* energía;
* puntuación;
* capturas;
* gallinas;
* tiempo;
* estado de la partida;
* ganador.

El frontend se encarga principalmente de la representación y de proporcionar una respuesta visual inmediata al movimiento.