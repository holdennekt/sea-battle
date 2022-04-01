import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import useLocalStorage from "./useLocalStorage";
import hit from "../images/hit.png";
import dot from "../images/dot.png";
import { getCoords } from "../utils/shipsPlacementFuncs";

const SERVER_URL = "http://localhost:8000";

const useGame = (opponent, gameId, endGame) => {
  //  тут реалізовується клієнтська сторона гри

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [myShips, setMyShips] = useState([]);
  const [myShots, setMyShots] = useState([]);
  const [opponentShips, setOpponentShips] = useState([]);
  const [opponentShots, setOpponentShots] = useState([]);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const [username] = useLocalStorage("username");
  const [userId] = useLocalStorage("userId");

  const socketRef = useRef(null);

  const submitShips = (ships) => {
    socketRef.current.emit("ships", ships);
    setMyShips(ships);
    setIsWaiting(true);
  };

  const shoot = ({ x, y }) => {
    socketRef.current.emit("move:make", { x, y });
    setIsMyTurn(false);
  };

  useEffect(() => {
    // створюємо екземпляр сокету і записуємо username
    socketRef.current = io(SERVER_URL, {
      auth: { username, userId, inGame: true, opponent, gameId },
    });

    socketRef.current.onAny((...args) => {
      console.log("socket recieved event:", args);
    });

    socketRef.current.on("game:started", (opponentShips) => {
      setIsWaiting(false);
      setIsGameStarted(true);
      setOpponentShips(opponentShips);
    });

    socketRef.current.on("move:request", () => {
      setIsMyTurn(true);
    });

    socketRef.current.on("move:result", ({ result, isHit }) => {
      if (isHit) {
        if (!result.isAlive) {
          const shipSelfIndexes100 = result.parts.map(
            (part) => part.y * 10 + part.x
          );
          const { startI, startJ, endI, endJ } = getCoords(result.parts);
          for (let i = startI; i <= endI; i++) {
            for (let j = startJ; j <= endJ; j++) {
              const index100 = i * 10 + j;
              if (shipSelfIndexes100.some((index) => index === index100))
                continue;
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
        const newParts = result.parts.map((part) => ({ ...part, imgSrc: hit }));
        setOpponentShips((oldShips) =>
          oldShips.map((ship) =>
            ship.id === result.id ? { ...result, parts: newParts } : ship
          )
        );
      } else {
        setMyShots((oldShots) => [
          ...oldShots,
          { x: result.x, y: result.y, imgSrc: dot },
        ]);
      }
    });

    socketRef.current.on("move:opponent", ({ result, isHit }) => {
      if (isHit) {
        if (!result.isAlive) {
          const newParts = result.parts.map((part) => ({
            ...part,
            x: part.x + result.x,
            y: part.y + result.y,
          }));
          const shipSelfIndexes100 = newParts.map(
            (part) => part.y * 10 + part.x
          );
          const { startI, startJ, endI, endJ } = getCoords(newParts);
          for (let i = startI; i <= endI; i++) {
            for (let j = startJ; j <= endJ; j++) {
              const index100 = i * 10 + j;
              if (shipSelfIndexes100.some((index) => index === index100))
                continue;
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
        const newParts = result.parts.map((part) =>
          part.isAlive === false ? { ...part, imgSrc: hit } : part
        );
        setMyShips((oldShips) =>
          oldShips.map((ship) =>
            ship.id === result.id ? { ...result, parts: newParts } : ship
          )
        );
      } else {
        setOpponentShots((oldShots) => [
          ...oldShots,
          { x: result.x, y: result.y, imgSrc: dot },
        ]);
      }
    });

    return () => {
      // при розмонтуванні компоненту відключаємо сокет
      socketRef.current.off("move:result");
      socketRef.current.off("move:opponent");
      socketRef.current.disconnect();
    };
  }, [username, userId, gameId, opponent]);

  return {
    isGameStarted,
    myShips,
    myShots,
    opponentShips,
    opponentShots,
    isMyTurn,
    isWaiting,
    submitShips,
    shoot,
  };
};

export default useGame;
