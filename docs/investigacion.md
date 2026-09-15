# Investigación y publicación

## Pruebas E2E

Se utiliza **Playwright** para realizar pruebas End-to-End.

Las pruebas se ejecutan contra la aplicación completa y comprueban el funcionamiento desde la perspectiva del navegador.

Actualmente se cubren:

1. inicio de una partida y representación del juego;
2. comunicación real del movimiento con `POST /api/game/move`;
3. respuesta JSON del backend mediante `GET /api/game`.

Las pruebas utilizan la aplicación compilada y ejecutada mediante Express.

### Ejecución local

Para instalar los navegadores de Playwright:

```bash
npx playwright install
```

Para ejecutar las pruebas normalmente:

```bash
npm run test:e2e
```

Para ejecutar las pruebas mostrando Chrome:

```bash
npm run test:e2e:headed
```

El modo `headed` permite observar visualmente lo que hace Playwright durante la ejecución.

En GitHub Actions las pruebas se ejecutan en modo headless.

## Configuración de Playwright

Playwright utiliza como servidor de pruebas:

```bash
npm run build && npm run start
```

La aplicación se prueba mediante:

```text
http://127.0.0.1:3000
```

La configuración evita reutilizar un servidor existente durante las pruebas locales, de manera que cada ejecución utilice una versión recién compilada del proyecto.

## Publicación

El proyecto está preparado para Render mediante `render.yaml`.

El servicio web utiliza:

```bash
npm ci && npm run build
```

como comando de construcción y:

```bash
npm start
```

como comando de inicio.

Express escucha en el puerto proporcionado mediante:

```ts
process.env.PORT
```

y utiliza `0.0.0.0` como host para permitir el acceso desde el servicio de hosting.

El frontend compilado se genera dentro de:

```text
server/public
```

y Express lo sirve junto con la API.

## Health check

El servicio puede utilizar el endpoint:

```text
GET /healthz
```

para comprobar que el servidor está funcionando correctamente.

La respuesta indica que el servicio está disponible.

## Render

La configuración de Render se encuentra en:

```text
render.yaml
```

El archivo define:

* tipo de servicio web;
* entorno Node;
* versión de Node;
* comando de construcción;
* comando de inicio;
* endpoint de health check.

## GitHub Actions

El proyecto contiene tres workflows:

* `lint.yml`: comprueba la calidad del código frontend y backend mediante ESLint.
* `e2e.yml`: ejecuta las pruebas End-to-End con Playwright.
* `deploy.yml`: realiza el proceso de publicación mediante un Deploy Hook de Render.

El workflow de despliegue utiliza el secreto:

```text
RENDER_DEPLOY_HOOK
```

Este secreto pertenece a GitHub Actions y no debe incluirse directamente en el código fuente.

El Deploy Hook se configura en Render y su valor se almacena como secreto del repositorio de GitHub.

## Flujo de despliegue

El flujo esperado es:

```text
Push a main
    ↓
GitHub Actions
    ↓
Instalación de dependencias
    ↓
Build
    ↓
Deploy Hook
    ↓
Render
    ↓
npm ci && npm run build
    ↓
npm start
    ↓
Aplicación publicada
```

El archivo `render.yaml` y el workflow `deploy.yml` cumplen funciones diferentes: `render.yaml` describe la configuración del servicio para Render, mientras que `deploy.yml` automatiza el proceso desde GitHub Actions.

## Fuentes consultadas

* React Documentation. Documentación oficial de React. https://react.dev/
* TypeScript Handbook. Documentación oficial de TypeScript. https://www.typescriptlang.org/docs/handbook/
* Express.js Documentation — Routing. Documentación oficial de Express.js. https://expressjs.com/en/guide/routing.html
* MDN Web Docs — Using the Fetch API. Documentación sobre la API Fetch y las solicitudes HTTP. https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
* MDN Web Docs — Making network requests with JavaScript. Documentación sobre solicitudes de red, JSON y APIs REST. https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Network_requests
* Playwright Documentation — Writing tests. Documentación oficial sobre pruebas automatizadas E2E. https://playwright.dev/docs/writing-tests
* Playwright Documentation — Running and debugging tests. Documentación sobre ejecución de pruebas en modo headless y headed. https://playwright.dev/docs/running-tests