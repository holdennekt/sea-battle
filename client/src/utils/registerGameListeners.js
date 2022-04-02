import hit from "../images/hit.png";
import dot from "../images/dot.png";
import { getCoords } from "./shipsPlacementFuncs";

const registerGameListeners = (...args) => {
  const [
    socket,
    setIsWaiting,
    setIsGameStarted,
    setIsMyTurn,
    setMyShips,
    setMyShots,
    setOpponentShips,
    setOpponentShots,
    onGameFinished,
  ] = args;

  socket.onAny((...args) => {
    console.log("socket recieved event:", args);
  });

  socket.on("game:started", (opponentShips) => {
    setIsWaiting(false);
    setIsGameStarted(true);
    setOpponentShips(opponentShips);
  });

  socket.on("move:request", () => {
    setIsMyTurn(true);
  });

  socket.on("my:hit", (ship) => {
    if (!ship.isAlive) {
      const shipIndexes100 = ship.parts.map((part) => part.y * 10 + part.x);
      const { startI, startJ, endI, endJ } = getCoords(ship.parts);
      for (let i = startI; i <= endI; i++) {
        for (let j = startJ; j <= endJ; j++) {
          const index100 = i * 10 + j;
          if (shipIndexes100.some((index) => index === index100)) continue;
          setMyShots((oldShots) => {
            const existingShot = oldShots.find(
              (shot) => shot.x === j && shot.y === i
            );
            const newShots = [...oldShots];
            if (!existingShot) newShots.push({ x: j, y: i, imgSrc: dot });
            return newShots;
          });
        }
      }
    }
    const newParts = ship.parts.map((part) =>
      part.isAlive === false ? { ...part, imgSrc: hit } : part
    );
    setOpponentShips((oldShips) =>
      oldShips.map((oldShip) =>
        oldShip.id === ship.id ? { ...ship, parts: newParts } : oldShip
      )
    );
  });

  socket.on("my:miss", (shot) => {
    setMyShots((oldShots) => [
      ...oldShots,
      { x: shot.x, y: shot.y, imgSrc: dot },
    ]);
  });

  socket.on("opponent:hit", (ship) => {
    if (!ship.isAlive) {
      const newParts = ship.parts.map((part) => ({
        x: part.x + ship.x,
        y: part.y + ship.y,
      }));
      const shipIndexes100 = newParts.map((part) => part.y * 10 + part.x);
      const { startI, startJ, endI, endJ } = getCoords(newParts);
      for (let i = startI; i <= endI; i++) {
        for (let j = startJ; j <= endJ; j++) {
          const index100 = i * 10 + j;
          if (shipIndexes100.some((index) => index === index100)) continue;
          setOpponentShots((oldShots) => {
            const existingShot = oldShots.find(
              (shot) => shot.x === j && shot.y === i
            );
            const newShots = [...oldShots];
            if (!existingShot) newShots.push({ x: j, y: i, imgSrc: dot });
            return newShots;
          });
        }
      }
    }
    const newParts = ship.parts.map((part) =>
      part.isAlive === false ? { ...part, imgSrc: hit } : part
    );
    setMyShips((oldShips) =>
      oldShips.map((oldShip) =>
        oldShip.id === ship.id ? { ...ship, parts: newParts } : oldShip
      )
    );
  });

  socket.on("opponent:miss", (shot) => {
    setOpponentShots((oldShots) => [
      ...oldShots,
      { x: shot.x, y: shot.y, imgSrc: dot },
    ]);
  });

  socket.on("game:over", onGameFinished);
};

export default registerGameListeners;
