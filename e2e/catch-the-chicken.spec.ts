import { test, expect } from "@playwright/test";

test("inicia una partida y muestra el juego", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Catch the Chicken!/i })).toBeVisible();
  await expect(page.getByText(/GANA: EL PRIMERO EN LLEGAR A 20/i)).toBeVisible();
  await expect(page.getByText("🟥 Rojo", { exact: true })).toBeVisible();
  await expect(page.getByText("🟦 Azul", { exact: true })).toBeVisible();
});

test("la aplicación comunica el movimiento con el backend", async ({ page }) => {
  await page.goto("/");
  await page.locator("main.app").focus();
  const responsePromise = page.waitForResponse(
    response => response.url().includes("/api/game/move") && response.request().method() === "POST"
  );
  await page.keyboard.down("d");
  await page.waitForTimeout(250);
  await page.keyboard.up("d");
  const response = await responsePromise;
  expect(response.ok()).toBeTruthy();
});

test("el endpoint de partida devuelve JSON", async ({ request }) => {
  const response = await request.get("/api/game");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.players.p1).toBeTruthy();
  expect(body.players.p2).toBeTruthy();
  expect(Array.isArray(body.chickens)).toBeTruthy();
});
