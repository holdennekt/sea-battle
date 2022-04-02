import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import useLocalStorage from "./useLocalStorage";
import registerGameListeners from "../utils/registerGameListeners";

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
  const [winner, setWinner] = useState();

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

  const onGameFinished = (winner) => {
    setWinner(winner);
    setTimeout(endGame, 10000);
  };

  useEffect(() => {
    // створюємо екземпляр сокету і записуємо username
    socketRef.current = io(SERVER_URL, {
      auth: { username, userId, inGame: true, opponent, gameId },
    });

    registerGameListeners(
      socketRef.current,
      setIsWaiting,
      setIsGameStarted,
      setIsMyTurn,
      setMyShips,
      setMyShots,
      setOpponentShips,
      setOpponentShots,
      onGameFinished
    );

    return () => {
      // при розмонтуванні компоненту відключаємо сокет
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
    winner,
    submitShips,
    shoot,
  };
};

export default useGame;
