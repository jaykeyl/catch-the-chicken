# 🐔 Catch the Chicken!

Juego web multijugador local creado con React + TypeScript y Express + TypeScript.

## Requisitos

- Node.js 22+
- npm

## Instalar

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend/API: http://localhost:3000

Vite usa proxy `/api` durante desarrollo. En producción Express sirve el frontend compilado y la API bajo el mismo dominio y puerto.

## Producción local

```bash
npm run build
npm start
```

Abrir http://localhost:3000

## Controles

- Jugador 1: W A S D
- Jugador 2: flechas
- Captura P1: botón rojo
- Captura P2: botón azul
- También pueden incorporarse atajos de captura en una futura mejora.

## API

- `GET /api/game` obtiene el estado actual.
- `POST /api/game` crea/reinicia una partida.
- `POST /api/game/move` valida y aplica movimiento.
- `POST /api/game/capture` valida proximidad, calcula puntos y reemplaza la gallina capturada.

Todas las entradas y salidas usan JSON.

## Lint

```bash
npm run lint
```

## E2E

```bash
npx playwright install
npm run test:e2e
npm run test:e2e:headed
```

## Deploy

El archivo `render.yaml` define un servicio web para Render. También se incluye un workflow de GitHub Actions para disparar un Deploy Hook de Render mediante el secreto `RENDER_DEPLOY_HOOK`.

## IA

La IA se utilizó como asistente para proponer arquitectura, código, pruebas y documentación. El estudiante debe revisar, ejecutar, comprender y modificar el código antes de la defensa.
