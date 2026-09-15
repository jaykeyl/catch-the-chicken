import type { GameState, PlayerId } from "./types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message ?? "Error de servidor");
  }
  return body;
}

export function createGame() {
  return request<GameState>("/api/game", { method: "POST", body: "{}" });
}

export function getGame() {
  return request<GameState>("/api/game");
}

export function movePlayer(playerId: PlayerId, dx: number, dy: number) {
  return request<GameState>("/api/game/move", {
    method: "POST",
    body: JSON.stringify({ playerId, dx, dy })
  });
}

export function captureChicken(playerId: PlayerId) {
  return request<{ state: GameState; captured: boolean; message: string }>("/api/game/capture", {
    method: "POST",
    body: JSON.stringify({ playerId })
  });
}
