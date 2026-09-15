# Introducción

## Nombre

Catch the Chicken!

## Propósito

Catch the Chicken! es un juego web competitivo para dos jugadores. Los jugadores recorren una granja mientras persiguen gallinas que se desplazan por el escenario.

El objetivo es conseguir 20 puntos antes que el rival.

La experiencia combina movimiento, captura de recursos, riesgo y decisiones sobre qué gallina perseguir.

## Tipo de jugadores

Hay exactamente dos jugadores en el mismo navegador/dispositivo.

- Jugador 1: W A S D.
- Jugador 2: flechas.

## Flujo

1. Se inicia una partida.
2. Express genera el estado inicial y las gallinas.
3. Cada jugador se mueve por el campo.
4. Las gallinas cambian de posición automáticamente.
5. El jugador intenta capturar una gallina cuando está suficientemente cerca.
6. Express valida la captura y modifica la puntuación.
7. El primer jugador en alcanzar 20 puntos gana.
8. Si se termina el tiempo antes, gana quien tenga más puntos; si hay igualdad, hay empate.
