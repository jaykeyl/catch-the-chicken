export type PlayerId = "p1" | "p2";
export type GameStatus = "waiting" | "playing" | "finished";

export interface Player {
  id: PlayerId;
  name: string;
  x: number;
  y: number;
  score: number;
  energy: number;
  captured: number;
}

export type ChickenKind = "normal" | "golden" | "fast" | "trick";

export interface Chicken {
  id: string;
  x: number;
  y: number;
  kind: ChickenKind;
  value: number;
}

export interface GameState {
  id: string;
  status: GameStatus;
  winner: PlayerId | null;
  timeLeft: number;
  players: Record<PlayerId, Player>;
  chickens: Chicken[];
  message: string;
}
