# 🐔 Catch the Chicken!

Juego web competitivo para dos jugadores desarrollado con **React + TypeScript** en el frontend y **Express + TypeScript** en el backend.

Los dos jugadores comparten el mismo navegador y teclado. El objetivo es capturar gallinas, conseguir puntos y llegar a 20 antes que el rival.

## 🎮 Características

* Dos jugadores en el mismo navegador.
* Campo de juego que utiliza el espacio disponible.
* Gallinas con movimiento automático.
* Cuatro tipos de gallinas:

  * normal;
  * rápida;
  * dorada;
  * tramposa.
* Sistema de puntuación.
* Sistema de energía.
* Límite de tiempo.
* Capturas validadas por el backend.
* Movimiento visual inmediato.
* Comunicación real entre React y Express mediante `fetch`.
* Pruebas E2E con Playwright.
* Automatización mediante GitHub Actions.
* Configuración de publicación para Render.

## 🛠️ Tecnologías

* React
* TypeScript
* Express
* Vite
* Playwright
* ESLint
* GitHub Actions
* Render

No se utiliza un motor de juegos ni una librería externa para implementar la lógica principal del juego.

## 📋 Requisitos

* Node.js 22+
* npm

## 📦 Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

## 🚀 Desarrollo

Ejecutar frontend y backend:

```bash
npm run dev
```

Durante el desarrollo:

```text
Frontend: http://localhost:5173
Backend/API: http://localhost:3000
```

Vite utiliza un proxy para las rutas `/api`, permitiendo que el frontend se comunique con Express durante el desarrollo.

## 🏭 Producción local

Compilar el proyecto:

```bash
npm run build
```

Iniciar Express:

```bash
npm start
```

Abrir:

```text
http://localhost:3000
```

En producción, Express sirve el frontend compilado y la API bajo el mismo dominio y puerto.

El frontend compilado se encuentra en:

```text
server/public
```

## 🎮 Controles

### 🟥 Rojo

Movimiento:

```text
W A S D
```

Captura:

```text
ESPACIO
```

### 🟦 Azul

Movimiento:

```text
FLECHAS
```

Captura:

```text
ENTER
```

## 🏆 Objetivo

El primer jugador en conseguir **20 puntos** gana.

Si el tiempo termina antes:

* gana quien tenga más puntos;
* si ambos tienen la misma puntuación, hay empate.

## 🐔 Gallinas

| Tipo     | Puntos |
| -------- | -----: |
| Normal   |     +1 |
| Rápida   |     +2 |
| Dorada   |     +3 |
| Tramposa |     -1 |

Las gallinas se generan con posiciones, direcciones y velocidades variables.

Las gallinas rápidas se desplazan a mayor velocidad.

Las gallinas tramposas también reducen la energía del jugador.

## ⚡ Energía

Moverse consume energía.

Capturar gallinas normales, rápidas y doradas recupera una pequeña cantidad.

Las gallinas tramposas producen una penalización adicional.

La energía se controla y valida en el backend.

## 🌐 API

La aplicación utiliza los siguientes endpoints:

### `GET /api/game`

Obtiene el estado actual de la partida.

### `POST /api/game`

Crea o reinicia una partida.

### `POST /api/game/move`

Valida y aplica un movimiento.

### `POST /api/game/capture`

Valida la proximidad a una gallina, calcula la puntuación, actualiza la energía y genera una nueva gallina.

Todas las entradas y respuestas de la API utilizan JSON.

La documentación completa de la API se encuentra en:

```text
docs/api.md
```

## 🧪 Lint

Ejecutar ESLint:

```bash
npm run lint
```

## 🎭 E2E

Las pruebas End-to-End utilizan Playwright.

Instalar los navegadores de Playwright:

```bash
npx playwright install
```

Ejecutar las pruebas:

```bash
npm run test:e2e
```

Ejecutar las pruebas mostrando Chrome:

```bash
npm run test:e2e:headed
```

Las pruebas comprueban:

* inicio y representación del juego;
* comunicación del movimiento con `POST /api/game/move`;
* respuesta JSON de `GET /api/game`.

Playwright utiliza una aplicación recién compilada y evita reutilizar un servidor local existente durante las pruebas.

## ⚙️ GitHub Actions

El proyecto contiene tres workflows:

```text
.github/workflows/
├── lint.yml
├── e2e.yml
└── deploy.yml
```

### `lint.yml`

Comprueba el código mediante ESLint.

### `e2e.yml`

Ejecuta las pruebas End-to-End con Playwright.

### `deploy.yml`

Ejecuta el proceso de publicación mediante un Deploy Hook de Render.

El workflow utiliza el secreto:

```text
RENDER_DEPLOY_HOOK
```

Este secreto debe configurarse en:

```text
GitHub → Settings → Secrets and variables → Actions
```

No debe escribirse directamente en el repositorio.

## ☁️ Render

El proyecto incluye:

```text
render.yaml
```

Este archivo define la configuración del servicio web de Render.

La construcción utiliza:

```bash
npm ci && npm run build
```

El servidor se inicia con:

```bash
npm start
```

Express utiliza el puerto proporcionado mediante `process.env.PORT` y escucha en `0.0.0.0`.

El frontend compilado se sirve desde `server/public`.

## 🔄 Despliegue

El flujo de publicación es:

```text
Push a main
    ↓
GitHub Actions
    ↓
Lint / E2E / Build
    ↓
Deploy Hook de Render
    ↓
Render
    ↓
Build
    ↓
npm start
    ↓
Aplicación publicada
```

El archivo `render.yaml` describe el servicio para Render, mientras que `deploy.yml` automatiza el disparo del despliegue desde GitHub Actions.

El enlace al despliegue en Render es: https://catch-the-chicken.onrender.com/

## 📽️ Video

El video mostrando distintas caracteristicas del juego, un e2e test y el despliegue se encuentran aca:

[Ver el video de demostración del proyecto](./client/public/videos/catch-the-chicken.mp4)

## 📚 Documentación

La documentación adicional se encuentra en `docs/`:

```text
docs/
├── api.md
├── decisiones.md
├── ia.md
├── introduccion.md
├── investigacion.md
└── reglas.md
```

## 🤖 Uso de IA

La IA fue utilizada como asistente durante el desarrollo para proponer arquitectura, código, pruebas, solución de problemas y documentación.

El código fue revisado y probado por mi.

El registro detallado se encuentra en:

```text
docs/ia.md
```

## 😸 Desarrollo

Desarrollado por jaykeyl para la materia de Certificacion React
