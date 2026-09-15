# Reglas

## Objetivo

El objetivo de la partida es conseguir **20 puntos antes que el rival**.

La partida comienza automáticamente con dos jugadores y un conjunto de gallinas distribuidas aleatoriamente por el campo.

## Jugadores

### Rojo

Se mueve utilizando:

* W: arriba.
* A: izquierda.
* S: abajo.
* D: derecha.

Captura utilizando:

* ESPACIO.

### Azul

Se mueve utilizando:

* Flecha arriba.
* Flecha izquierda.
* Flecha abajo.
* Flecha derecha.

Captura utilizando:

* ENTER.

## Tipos de gallinas

Existen cuatro tipos:

| Tipo     | Puntuación |
| -------- | ---------: |
| Normal   |         +1 |
| Rápida   |         +2 |
| Dorada   |         +3 |
| Tramposa |         -1 |

La gallina rápida se desplaza a mayor velocidad que una gallina normal.

Las gallinas doradas ofrecen una mayor recompensa.

Las gallinas tramposas reducen la puntuación y además penalizan la energía.

## Puntuación

* Gallina normal: **+1 punto**.
* Gallina rápida: **+2 puntos**.
* Gallina dorada: **+3 puntos**.
* Gallina tramposa: **-1 punto**.

La puntuación nunca puede ser inferior a cero.

## Energía

Los movimientos consumen energía.

Las capturas de gallinas normales, rápidas y doradas recuperan una pequeña cantidad de energía.

Las gallinas tramposas producen una penalización adicional de energía.

La energía se mantiene en el backend y se valida al realizar cada movimiento.

Esto genera una decisión estratégica: el jugador debe elegir entre desplazarse rápidamente hacia una gallina, conservar energía o buscar una gallina de mayor valor.

## Movimiento

El movimiento se muestra inmediatamente en pantalla para que la interacción sea fluida.

Al mismo tiempo, cada movimiento se comunica al backend.

Express valida:

* el jugador;
* la magnitud del movimiento;
* la energía disponible;
* los límites del campo.

El jugador no puede desplazarse fuera de los límites establecidos por el servidor.

## Captura

Una captura solamente es válida cuando el jugador se encuentra dentro de la distancia máxima definida por el backend.

Al realizar una captura:

1. se busca la gallina más cercana;
2. se comprueba la distancia;
3. se calcula la puntuación;
4. se actualiza la energía;
5. se incrementa el contador de capturas;
6. se elimina la gallina capturada;
7. se genera una nueva gallina.

Si no existe una gallina suficientemente cerca, no se realiza la captura y se muestra un mensaje al jugador.

## Movimiento de las gallinas

Las gallinas se desplazan automáticamente por el escenario.

Su posición cambia con el tiempo y pueden cambiar ligeramente de dirección.

Las gallinas respetan los límites del campo y rebotan cuando llegan a ellos.

La velocidad depende del tipo de gallina.

## Tiempo

La partida tiene un límite de tiempo de **120 segundos**.

El servidor controla el contador de tiempo.

## Finalización

La partida termina inmediatamente cuando un jugador alcanza **20 puntos**.

También termina cuando el contador llega a cero.

Si el tiempo termina:

* gana el jugador con mayor puntuación;
* si ambos tienen la misma puntuación, el resultado es empate.

Una vez finalizada la partida, el backend rechaza nuevos movimientos y capturas.