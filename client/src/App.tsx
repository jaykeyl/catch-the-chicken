import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { captureChicken, createGame, getGame, movePlayer } from "./api";
import type { GameState, PlayerId } from "./types";

const STEP = 3;

function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [error, setError] = useState("");

  // Teclas que están siendo presionadas
  const keys = useRef(new Set<string>());

  // Evita mandar muchos movimientos al servidor al mismo tiempo
  const moveLock = useRef(false);

  // Referencia al elemento principal para darle foco
  const appRef = useRef<HTMLElement | null>(null);

  // INICIAR PARTIDA

  const start = useCallback(async () => {
    try {
      setError("");

      const newGame = await createGame();

      setGame(newGame);

      // Limpiar teclas por si había alguna presionada
      keys.current.clear();

      // Dar foco al juego
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

  // Iniciar partida al cargar
  useEffect(() => {
    void start();
  }, [start]);

  // =========================
  // SINCRONIZAR CON SERVIDOR
  // =========================

  useEffect(() => {
    if (!game || game.status !== "playing") {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const updatedGame = await getGame();
        setGame(updatedGame);
      } catch {
        // El siguiente ciclo volverá a intentar sincronizar.
      }
    }, 400);

    return () => {
      window.clearInterval(timer);
    };
  }, [game?.status]);

  // CAPTURAR GALLINA

  const capture = useCallback(async (playerId: PlayerId) => {
    try {
      setError("");

      const result = await captureChicken(playerId);

      setGame(result.state);

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

  // TECLADO

  const handleKeyDown = (
    event: KeyboardEvent<HTMLElement>
  ) => {
    const key = event.key.toLowerCase();

    // Evitar scroll con espacio
    // y acciones automáticas con Enter
    if (key === " " || key === "enter") {
      event.preventDefault();
    }

    // Si la partida no está activa,
    // no hacemos acciones de juego
    if (game?.status !== "playing") {
      return;
    }

    // ESPACIO PARA QUE JUGADOR 1 PUEDA CAPTURAR

    if (key === " ") {
      void capture("p1");
      return;
    }

    // ENTER PARA QUE JUGADOR 2 PUEDA CAPTURAR

    if (key === "enter") {
      void capture("p2");
      return;
    }

    // MOVIMIENTO

    keys.current.add(key);
  };

  const handleKeyUp = (
    event: KeyboardEvent<HTMLElement>
  ) => {
    const key = event.key.toLowerCase();

    keys.current.delete(key);
  };

  // MOVIMIENTO

  useEffect(() => {
    if (!game || game.status !== "playing") {
      return;
    }

    const timer = window.setInterval(async () => {
      // Si ya estamos procesando un movimiento,
      // esperamos al siguiente ciclo.
      if (moveLock.current) {
        return;
      }

      let p1dx = 0;
      let p1dy = 0;

      let p2dx = 0;
      let p2dy = 0;

      // JUGADOR 1 TECLAS WASD

      if (keys.current.has("w")) {
        p1dy -= STEP;
      }

      if (keys.current.has("s")) {
        p1dy += STEP;
      }

      if (keys.current.has("a")) {
        p1dx -= STEP;
      }

      if (keys.current.has("d")) {
        p1dx += STEP;
      }

      // JUGADOR 2 TECLAS UP, DOWN, LEFT, RIGHT

      if (keys.current.has("arrowup")) {
        p2dy -= STEP;
      }

      if (keys.current.has("arrowdown")) {
        p2dy += STEP;
      }

      if (keys.current.has("arrowleft")) {
        p2dx -= STEP;
      }

      if (keys.current.has("arrowright")) {
        p2dx += STEP;
      }

      // Si nadie se mueve, no hacemos petición
      if (
        p1dx === 0 &&
        p1dy === 0 &&
        p2dx === 0 &&
        p2dy === 0
      ) {
        return;
      }

      moveLock.current = true;

      try {
        // MOVIMIENTO JUGADOR 1

        if (p1dx !== 0 || p1dy !== 0) {
          const newGame = await movePlayer(
            "p1",
            p1dx,
            p1dy
          );

          setGame(newGame);
        }

        // MOVIMIENTO JUGADOR 2

        if (p2dx !== 0 || p2dy !== 0) {
          const newGame = await movePlayer(
            "p2",
            p2dx,
            p2dy
          );

          setGame(newGame);
        }
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "No se pudo mover"
        );
      } finally {
        moveLock.current = false;
      }
    }, 90);

    return () => {
      window.clearInterval(timer);
    };
  }, [game?.status]);

  // PANTALLA DE CARGA

  if (!game) {
    return (
      <main className="loading">
        <h1>Catch the Chicken! </h1>

        <p>
          Cargando partida...
        </p>

        {error && (
          <p className="error">
            {error}
          </p>
        )}
      </main>
    );
  }

  // JUEGO

  return (
    <main
      ref={appRef}
      className="app"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >

      {/* CABECERA */}

      <header className="topbar">
        <div>
          <h1> Catch the Chicken! </h1>
        </div>

        <div className="timer">
          ⏱️ {Math.ceil(game.timeLeft)}s
        </div>
      </header>


      {/* MARCADOR */}

      <section className="scoreboard">
        <PlayerCard
          player={game.players.p1}
          color="red"
        />
        <div className="goal">
          GANA: EL PRIMERO A 20
        </div>
        <PlayerCard
          player={game.players.p2}
          color="blue"
        />
      </section>


      {/* INSTRUCCIONES */}

      <section className="instructions">
        <span> 🟥 Jugador 1: muévete con W A S D y captura con ESPACIO. </span>
        <span> Las gallinas doradas valen más, pero las gallinas tramposas pueden quitarte puntos. </span>
        <span> 🟦 Jugador 2: muévete con FLECHAS y captura con ENTER. </span>        
      </section>


      {/* CAMPO DE JUEGO */}

      <section
        className="field"
        aria-label="Campo de juego"
      >

        {/* Gallinas */}

        {game.chickens.map((chicken) => (
          <div
            key={chicken.id}
            className={`chicken chicken-${chicken.kind}`}
            style={{left: `${chicken.x}%`, top: `${chicken.y}%`}}
            title={`${chicken.kind}: ${chicken.value} puntos`}>
            <img
              src={
                chicken.kind === "golden"
                  ? "/images/golden_chicken.png"
                  : chicken.kind === "trick"
                    ? "/images/chicken_purple.png"
                    : chicken.kind === "fast"
                      ? "/images/chicken.png"
                      : "/images/chicken.png"
              }
              alt={`Gallina ${chicken.kind}`}
            />
          </div>
        ))}


        {/* Jugador 1 */}

        <div
          className="player p1"
          style={{
            left: `${game.players.p1.x}%`, top: `${game.players.p1.y}%`}}>
          <img src="/images/red.png" alt="Jugador 1" />
        </div>


        {/* Jugador 2 */}

        <div
          className="player p2"
          style={{
            left: `${game.players.p2.x}%`, top: `${game.players.p2.y}%`}}>
          <img src="/images/blue.png" alt="Jugador 2" />
        </div>


        {/* FIN DE PARTIDA*/}

        {game.status === "finished" && (
          <div className="game-over">
            <div className="modal">
              <div className="trophy">
                <img src="/images/trophy.png" alt="Trofeo" />
              </div>

              <h2> {game.winner ? `¡${game.players[game.winner].name} gana!` : "Fin de la partida"} </h2>

              <p> {game.message} </p>

              <button onClick={start}> Iniciar de nuevo </button>

            </div>
          </div>
        )}
      </section>


      {/* PARTE INFERIOR */}

      <footer className="bottom">
        <div className="status"> {game.message} </div>
      </footer>


      {/* ERROR */}

      {error && (
        <div className="toast error">
          {error}
        </div>
      )}

    </main>
  );
}


/* TARJETA DEL JUGADOR */

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
        {color === "red" ? "🟥" : "🟦"}{" "}
        {player.name}
      </div>

      <strong> {player.score} puntos</strong>

      <div className="stats">
        {Math.ceil(player.energy)} de energía - {player.captured} capturas
      </div>
    </div>
  );
}

export default App;