# Investigación y publicación

## E2E

Se utiliza Playwright.

Las pruebas cubren:

1. inicio y representación del juego;
2. comunicación real de movimiento con `POST /api/game/move`;
3. respuesta JSON del backend.

GitHub Actions ejecuta Playwright en modo headless.

Localmente se puede ejecutar:

```bash
npm run test:e2e:headed
```

para observar Chrome de forma visual.

## Publicación

El proyecto está preparado para Render mediante `render.yaml`.

El servicio ejecuta:

```bash
npm ci && npm run build
```

y luego:

```bash
npm start
```

Express utiliza `process.env.PORT`, por lo que puede recibir el puerto proporcionado por el servicio.

El frontend compilado queda dentro de `server/public` y Express lo sirve junto con la API.

## GitHub Actions

Hay tres workflows:

- `lint.yml`: valida frontend y backend.
- `e2e.yml`: ejecuta pruebas E2E.
- `deploy.yml`: dispara el despliegue mediante un Deploy Hook.

El secreto `RENDER_DEPLOY_HOOK` debe configurarse en GitHub para habilitar el paso de publicación.
