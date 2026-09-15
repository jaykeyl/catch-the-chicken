# API REST

## GET /api/game

Obtiene el estado actual.

Ejemplo:

```json
{
  "id": "game-123",
  "status": "playing",
  "winner": null,
  "timeLeft": 172,
  "players": {},
  "chickens": [],
  "message": "..."
}
```

## POST /api/game

Crea una partida nueva.

Body:

```json
{}
```

Devuelve `201` y el estado inicial.

## POST /api/game/move

Body:

```json
{
  "playerId": "p1",
  "dx": 3,
  "dy": 0
}
```

Express valida jugador, magnitud del movimiento, energía y límites del mapa.

## POST /api/game/capture

Body:

```json
{
  "playerId": "p1"
}
```

Express busca la gallina más cercana, valida la distancia, calcula los puntos, actualiza el estado y genera una nueva gallina.

Todas las respuestas son JSON.
