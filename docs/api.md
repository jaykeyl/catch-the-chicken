# API REST

La aplicación utiliza una API REST implementada con Express + TypeScript.

Durante el desarrollo, el frontend React se comunica con el backend mediante `fetch`. En producción, Express sirve tanto la API como el frontend compilado bajo el mismo dominio y puerto.

Todas las respuestas de la API utilizan formato JSON.

## GET /api/game

Obtiene el estado actual de la partida.

El backend actualiza la simulación antes de responder, incluyendo el tiempo restante y el movimiento de las gallinas.

Ejemplo:

```json
{
  "id": "game-123",
  "status": "playing",
  "winner": null,
  "timeLeft": 105.4,
  "players": {
    "p1": {
      "id": "p1",
      "name": "Rojo",
      "x": 15,
      "y": 50,
      "score": 0,
      "energy": 100,
      "captured": 0
    },
    "p2": {
      "id": "p2",
      "name": "Azul",
      "x": 85,
      "y": 50,
      "score": 0,
      "energy": 100,
      "captured": 0
    }
  },
  "chickens": [],
  "message": "¡Atrapa las gallinas! El primero en llegar a 20 gana."
}
```

Las velocidades internas de las gallinas no se exponen al frontend.

## POST /api/game

Crea o reinicia una partida.

Body:

```json
{}
```

Devuelve `201 Created` y el estado inicial de la partida.

Al iniciar una partida se generan las gallinas con posiciones, tipos, direcciones y velocidades iniciales variables.

## POST /api/game/move

Registra el movimiento de un jugador.

Body:

```json
{
  "playerId": "p1",
  "dx": 3,
  "dy": 0
}
```

El backend valida:

* que el jugador sea válido (`p1` o `p2`);
* que `dx` y `dy` sean valores numéricos;
* que el movimiento no supere la magnitud máxima permitida;
* que el jugador tenga suficiente energía;
* que la nueva posición permanezca dentro de los límites del campo.

Si el movimiento es válido, Express actualiza la posición y descuenta energía.

El frontend muestra el movimiento de forma inmediata para evitar retrasos perceptibles por la comunicación de red, mientras que el backend mantiene y valida el estado de la partida.

### Errores principales

* `400`: movimiento o jugador inválido.
* `409`: la partida terminó o no existe suficiente energía.

## POST /api/game/capture

Intenta capturar la gallina más cercana al jugador.

Body:

```json
{
  "playerId": "p1"
}
```

Express:

1. valida el jugador;
2. busca la gallina más cercana;
3. calcula la distancia entre el jugador y la gallina;
4. comprueba que esté dentro de la distancia máxima de captura;
5. calcula la puntuación según el tipo de gallina;
6. actualiza las capturas;
7. actualiza la energía;
8. elimina la gallina capturada;
9. genera una nueva gallina;
10. comprueba si la captura provoca el final de la partida.

Si no existe una gallina suficientemente cerca, la respuesta indica que la captura no fue realizada.

Si el jugador alcanza los 20 puntos, el backend finaliza inmediatamente la partida y establece el ganador.

## Estado del servidor

El estado de la partida se mantiene en memoria dentro del proceso de Express.

El backend es responsable de las reglas críticas del juego, mientras que React se encarga principalmente de representar la interfaz y proporcionar una respuesta visual inmediata al movimiento.

## Simulación de las gallinas

El servidor ejecuta periódicamente la función de actualización de la partida.

Las gallinas:

* cambian de posición;
* rebotan al alcanzar los límites del campo;
* pueden cambiar ligeramente de dirección;
* tienen diferentes velocidades según su tipo.

Esta simulación se ejecuta independientemente de la representación visual del frontend.