import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PlayerId = "p1" | "p2";
type ChickenKind = "normal" | "golden" | "fast" | "trick";
type GameStatus = "waiting" | "playing" | "finished";

interface Player {
  id: PlayerId;
  name: string;
  x: number;
  y: number;
  score: number;
  energy: number;
  captured: number;
}

interface Chicken {
  id: string;
  x: number;
  y: number;
  kind: ChickenKind;
  value: number;
  vx: number;
  vy: number;
}

interface GameState {
  id: string;
  status: GameStatus;
  winner: PlayerId | null;
  timeLeft: number;
  players: Record<PlayerId, Player>;
  chickens: Chicken[];
  message: string;
}

type PublicGameState = Omit<GameState, "chickens"> & {
  chickens: Omit<Chicken, "vx" | "vy">[];
};

const TARGET = 20;
const MAX_ENERGY = 100;
const MOVE_ENERGY = 0.3;
const CAPTURE_DISTANCE = 7;
const GAME_SECONDS = 120;

let game = createInitialGame();
let lastTick = Date.now();

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomKind(): ChickenKind {
  const n = Math.random();
  if (n < 0.08) return "golden";
  if (n < 0.23) return "fast";
  if (n < 0.33) return "trick";
  return "normal";
}

function valueFor(kind: ChickenKind) {
  return kind === "golden" ? 3 : kind === "fast" ? 2 : kind === "trick" ? -1 : 1;
}

function makeChicken(index: number): Chicken {
  const kind = randomKind();
  const speed = kind === "fast" ? 1.7 : random(.35, .8);
  const angle = random(0, Math.PI * 2);
  return {
    id: `chicken-${Date.now()}-${index}-${Math.floor(Math.random() * 10000)}`,
    x: random(7, 93),
    y: random(10, 90),
    kind,
    value: valueFor(kind),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed
  };
}

function createInitialGame(): GameState {
  const chickens = Array.from({ length: 14 }, (_, i) => makeChicken(i));
  return {
    id: `game-${Date.now()}`,
    status: "playing",
    winner: null,
    timeLeft: GAME_SECONDS,
    players: {
      p1: { id: "p1", name: "Rojo", x: 15, y: 50, score: 0, energy: MAX_ENERGY, captured: 0 },
      p2: { id: "p2", name: "Azul", x: 85, y: 50, score: 0, energy: MAX_ENERGY, captured: 0 }
    },
    chickens,
    message: "¡Atrapa las gallinas! El primero en llegar a 20 gana."
  };
}

function publicGame(): PublicGameState {
  return {
    ...game,
    chickens: game.chickens.map(({...chicken }) => chicken)
  };
}

function tick() {
  const now = Date.now();
  const delta = Math.min((now - lastTick) / 1000, 1);
  lastTick = now;

  if (game.status !== "playing") return;

  game.timeLeft = Math.max(0, game.timeLeft - delta);

  for (const chicken of game.chickens) {
    chicken.x += chicken.vx * delta * 5;
    chicken.y += chicken.vy * delta * 5;

    if (chicken.x < 5 || chicken.x > 95) {
      chicken.vx *= -1;
      chicken.x = Math.max(5, Math.min(95, chicken.x));
    }
    if (chicken.y < 7 || chicken.y > 93) {
      chicken.vy *= -1;
      chicken.y = Math.max(7, Math.min(93, chicken.y));
    }

    if (Math.random() < 0.01) {
      const angle = Math.atan2(chicken.vy, chicken.vx) + random(-0.8, 0.8);
      const speed = chicken.kind === "fast" ? 1.7 : random(.35, .8);
      chicken.vx = Math.cos(angle) * speed;
      chicken.vy = Math.sin(angle) * speed;
    }
  }

  if (game.timeLeft <= 0) {
    finishByScore();
  }
}

function finishByScore() {
  game.status = "finished";
  const p1 = game.players.p1;
  const p2 = game.players.p2;
  game.winner = p1.score === p2.score ? null : p1.score > p2.score ? "p1" : "p2";
  game.message = game.winner
    ? `${game.players[game.winner].name} ganó por puntuación.`
    : "¡Empate! Ambos terminaron con la misma puntuación.";
}

function distance(a: Player, b: Chicken) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function validatePlayer(playerId: unknown): playerId is PlayerId {
  return playerId === "p1" || playerId === "p2";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const app = express();
app.use(express.json());

app.get("/api/game", (_req, res) => {
  tick();
  res.json(publicGame());
});

app.post("/api/game", (_req, res) => {
  game = createInitialGame();
  lastTick = Date.now();
  res.status(201).json(publicGame());
});

app.post("/api/game/move", (req, res) => {
  tick();
  const { playerId, dx, dy } = req.body as { playerId?: unknown; dx?: unknown; dy?: unknown };

  if (!validatePlayer(playerId) || typeof dx !== "number" || typeof dy !== "number") {
    return res.status(400).json({ message: "Movimiento inválido." });
  }
  if (game.status !== "playing") {
    return res.status(409).json({ message: "La partida ya terminó." });
  }

  const player = game.players[playerId];
  const magnitude = Math.hypot(dx, dy);
  if (magnitude > 5 || magnitude === 0) {
    return res.status(400).json({ message: "Movimiento fuera de los límites." });
  }
  if (player.energy < MOVE_ENERGY) {
    return res.status(409).json({ message: "No tienes suficiente energía." });
  }

  player.x = clamp(player.x + dx, 3, 97);
  player.y = clamp(player.y + dy, 5, 95);
  player.energy = Math.max(0, player.energy - MOVE_ENERGY);

  return res.json(publicGame());
});

app.post("/api/game/capture", (req, res) => {
  tick();
  const { playerId } = req.body as { playerId?: unknown };

  if (!validatePlayer(playerId)) {
    return res.status(400).json({ message: "Jugador inválido." });
  }
  if (game.status !== "playing") {
    return res.status(409).json({ message: "La partida ya terminó." });
  }

  const player = game.players[playerId];
  let closestIndex = -1;
  let closestDistance = Infinity;

  game.chickens.forEach((chicken, index) => {
    const d = distance(player, chicken);
    if (d < closestDistance) {
      closestDistance = d;
      closestIndex = index;
    }
  });

  if (closestIndex < 0 || closestDistance > CAPTURE_DISTANCE) {
    return res.json({
      captured: false,
      message: "¡No hay ninguna gallina suficientemente cerca!",
      state: publicGame()
    });
  }

  const chicken = game.chickens[closestIndex];
  player.score = Math.max(0, player.score + chicken.value);
  player.captured += 1;

  if (chicken.kind === "trick") {
    player.energy = Math.max(0, player.energy - 10);
  } else {
    player.energy = Math.min(MAX_ENERGY, player.energy + 5);
  }
  game.chickens.splice(closestIndex, 1);
  game.chickens.push(makeChicken(Math.floor(Math.random() * 100000)));

  if (player.score >= TARGET) {
    game.status = "finished";
    game.winner = playerId;
    game.message = `El jugador ${player.name} llegó a ${TARGET} puntos y ganó.`;
  } else {
    game.message = chicken.kind === "trick"
      ? `${player.name} atrapó una gallina tramposa: -1 punto. y -10 de energia`
      : `${player.name} capturó una gallina y ganó ${chicken.value} punto${chicken.value === 1 ? "" : "s"}.`;
  }

  return res.json({ captured: true, message: game.message, state: publicGame() });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, "../public");

app.use(express.static(publicPath));
app.get("*splat", (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Catch the Chicken! disponible en el puerto ${port}`);
});
