import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { captureChicken, createGame, getGame, movePlayer } from "./api";
import type { GameState, PlayerId } from "./types";

const STEP = 3;

interface VisualPosition {
  x: number;
  y: number;
}

function PlayerCard({
  player,
  color
}: {
  player: GameState["players"]["p1"];
  color: "red" | "blue";
}) {
  return (
    <div className={`player-card ${color}`}>
      <div className="player-name">
        {color === "red" ? "🟥" : "🟦"} {player.name}
      </div>

      <strong>{player.score} puntos</strong>

      <div className="stats">
        {Math.ceil(player.energy)} de energía - {player.captured} capturas
      </div>
    </div>
  );
}

function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [error, setError] = useState("");

  // Teclas actualmente presionadas.
  const keys = useRef(new Set<string>());
  // Referencia al elemento principal para darle foco.
  const appRef = useRef<HTMLElement | null>(null);
  // Estas posiciones se actualizan inmediatamente en el navegador y no son reemplazadas por el polling del servidor.
  const visualPositions = useRef<Record<PlayerId, VisualPosition>>({
    p1: { x: 15, y: 50 },
    p2: { x: 85, y: 50 }
  });

  // Iniciar partida.
  const start = useCallback(async () => {
    try {
      setError("");

      const newGame = await createGame();

      // Guardar estado recibido del servidor.
      setGame(newGame);

      // Sincronizar las posiciones visuales iniciales.
      visualPositions.current = {
        p1: {
          x: newGame.players.p1.x,
          y: newGame.players.p1.y
        },
        p2: {
          x: newGame.players.p2.x,
          y: newGame.players.p2.y
        }
      };

      // Limpiar teclas por si alguna estaba presionada.
      keys.current.clear();

      // Dar foco al juego.
      setTimeout(() => {
        appRef.current?.focus();
      }, 0);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo iniciar"
      );
    }
  }, []);

  // Iniciar partida al cargar.
  useEffect(() => {
    void start();
  }, [start]);

  // Sincronizar información del servidor
  useEffect(() => {
    if (!game || game.status !== "playing") {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const updatedGame = await getGame();

        setGame((currentGame) => {
          if (!currentGame) {
            return updatedGame;
          }

          return {
            ...updatedGame,
            players: {
              ...updatedGame.players,

              p1: {
                ...updatedGame.players.p1,
                x: visualPositions.current.p1.x,
                y: visualPositions.current.p1.y
              },

              p2: {
                ...updatedGame.players.p2,
                x: visualPositions.current.p2.x,
                y: visualPositions.current.p2.y
              }
            }
          };
        });
      } catch {
        // El siguiente ciclo volvera a intentar sincronizar
      }
    }, 400);

    return () => {
      window.clearInterval(timer);
    };
  }, [game?.status]);

  // Capturar gallina
  const capture = useCallback(async (playerId: PlayerId) => {
    try {
      setError("");
      const result = await captureChicken(playerId);
      // Conservamos las posiciones visuales actuales
      setGame((currentGame) => {
        if (!currentGame) {
          return result.state;
        }

        return {
          ...result.state,
          players: {
            ...result.state.players,

            p1: {
              ...result.state.players.p1,
              x: visualPositions.current.p1.x,
              y: visualPositions.current.p1.y
            },

            p2: {
              ...result.state.players.p2,
              x: visualPositions.current.p2.x,
              y: visualPositions.current.p2.y
            }
          }
        };
      });

      if (!result.captured) {
        setError(result.message);
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo capturar"
      );
    }
  }, []);

  // Teclado.
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const key = event.key.toLowerCase();

    // Evitar scroll con espacio y Enter.
    if (key === " " || key === "enter") {
      event.preventDefault();
    }

    // No realizar acciones si la partida no está activa.
    if (game?.status !== "playing") {
      return;
    }

    // Jugador rojo: ESPACIO.
    if (key === " ") {
      void capture("p1");
      return;
    }

    // Jugador azul: ENTER.
    if (key === "enter") {
      void capture("p2");
      return;
    }

    keys.current.add(key);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLElement>) => {
    keys.current.delete(event.key.toLowerCase());
  };

  // Movimiento
  useEffect(() => {
    if (!game || game.status !== "playing") {
      return;
    }

    const timer = window.setInterval(() => {
      let p1dx = 0;
      let p1dy = 0;

      let p2dx = 0;
      let p2dy = 0;

      // jugador rojo - WASD.
      if (keys.current.has("w")) p1dy -= STEP;
      if (keys.current.has("s")) p1dy += STEP;
      if (keys.current.has("a")) p1dx -= STEP;
      if (keys.current.has("d")) p1dx += STEP;

      // jugador azul  - FLECHAS.
      if (keys.current.has("arrowup")) p2dy -= STEP;
      if (keys.current.has("arrowdown")) p2dy += STEP;
      if (keys.current.has("arrowleft")) p2dx -= STEP;
      if (keys.current.has("arrowright")) p2dx += STEP;

      // Actualizar posicion visual inmediatamente
      if (p1dx !== 0 || p1dy !== 0) {
        const currentPosition = visualPositions.current.p1;
        visualPositions.current.p1 = {
          x: Math.max(5, Math.min(95, currentPosition.x + p1dx)),
          y: Math.max(7, Math.min(93, currentPosition.y + p1dy))
        };
      }

      if (p2dx !== 0 || p2dy !== 0) {
        const currentPosition = visualPositions.current.p2;
        visualPositions.current.p2 = {
          x: Math.max(5, Math.min(95, currentPosition.x + p2dx)), y: Math.max(7, Math.min(93, currentPosition.y + p2dy))
        };
      }

      // Reflejar inmediatamente las posiciones
      if (p1dx !== 0 || p1dy !== 0 || p2dx !== 0 || p2dy !== 0) {
        setGame((currentGame) => {
          if (!currentGame || currentGame.status !== "playing") {
            return currentGame;
          }
          return {
            ...currentGame,
            players: {
              ...currentGame.players,
              p1: {
                ...currentGame.players.p1,
                x: visualPositions.current.p1.x,
                y: visualPositions.current.p1.y
              },
              p2: {
                ...currentGame.players.p2,
                x: visualPositions.current.p2.x,
                y: visualPositions.current.p2.y
              }
            }
          };
        });
      }

      // Informar al servidor
      if (p1dx !== 0 || p1dy !== 0) {
        void movePlayer("p1", p1dx, p1dy).catch((e) => {
          setError(e instanceof Error ? e.message: "No se pudo mover");
        });
      }

      if (p2dx !== 0 || p2dy !== 0) {
        void movePlayer("p2", p2dx, p2dy).catch((e) => {
          setError(e instanceof Error ? e.message: "No se pudo mover");
        });
      }
    }, 100);

    return () => {
      window.clearInterval(timer);
    };
  }, [game?.status]);

  // Pantalla de carga
  if (!game) {
    return (
      <main className="loading">
        <h1>Catch the Chicken!</h1>
        <p>Cargando partida...</p>
        {error && (<p className="error">{error}</p>)}
      </main>
    );
  }

  // Juego
  return (
    <main
      ref={appRef}
      className="app"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {/* Cabecera */}
      <header className="topbar">
        <div>
          <h1>Catch the Pollo!</h1>
        </div>
        <div className="timer">
          Tiempo restante: {Math.ceil(game.timeLeft)}s
        </div>
      </header>

      {/* Marcador */}
      <section className="scoreboard">
        <PlayerCard
          player={game.players.p1}
          color="red"
        />
        <div className="goal">
          GANA: EL PRIMERO EN LLEGAR A 20
        </div>
        <PlayerCard
          player={game.players.p2}
          color="blue"
        />
      </section>

      {/* Instrucciones */}
      <section className="instructions">
        <span>
          🟥 Rojo: muévete con W A S D y captura con ESPACIO.
        </span>
        <span>
          Las gallinas doradas valen más, pero las gallinas
          tramposas pueden quitarte puntos.
        </span>
        <span>
          🟦 Azul: muévete con FLECHAS y captura con ENTER.
        </span>
      </section>

      {/* Campo de juego */}
      <section
        className="field"
        aria-label="Campo de juego"
      >
        {/* Gallinas */}
        {game.chickens.map((chicken) => (
          <div
            key={chicken.id}
            className={`chicken chicken-${chicken.kind}`}
            style={{
              left: `${chicken.x}%`,
              top: `${chicken.y}%`
            }}
            title={`${chicken.kind}: ${chicken.value} puntos`}
          >
            <img
              src={
                chicken.kind === "golden"
                  ? "/images/golden_chicken.png"
                  : chicken.kind === "trick"
                    ? "/images/chicken_purple.png"
                    : "/images/chicken.png"
              }
              alt={`Gallina ${chicken.kind}`}
            />
          </div>
        ))}

        {/* Jugador Rojo */}
        <div
          className="player p1"
          style={{
            left: `${game.players.p1.x}%`,
            top: `${game.players.p1.y}%`
          }}
        >
          <img
            src="/images/red.png"
            alt="Jugador Rojo"
          />
        </div>

        {/* Jugador Azul */}
        <div
          className="player p2"
          style={{
            left: `${game.players.p2.x}%`,
            top: `${game.players.p2.y}%`
          }}
        >
          <img
            src="/images/blue.png"
            alt="Jugador Azul"
          />
        </div>

        {/* Fin de la partida */}
        {game.status === "finished" && (
          <div className="game-over">
            <div className="modal">
              <div className="trophy">
                <img
                  src="/images/trophy.png"
                  alt="Trofeo"
                />
              </div>

              <h2>
                {game.winner
                  ? `¡${game.players[game.winner].name} gana!`
                  : "Fin de la partida"}
              </h2>
              <p>{game.message}</p>
              <button onClick={start}>
                Iniciar de nuevo
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Estado del juego */}
      <footer className="bottom">
        <div className="status">
          {game.message}
        </div>
      </footer>

      {/* Error */}
      {error && (
        <div className="toast error"> {error} </div>)}
    </main>
  );
}

export default App;