import useGame from "../hooks/useGame";
import GamePreparation from "./GamePreparation";
import GameProcess from "./GameProcess";

const Game = ({ opponent, gameId, endGame }) => {
  const {
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
  } = useGame(opponent, gameId, endGame);

  return (
    <main className="game-container">
      {isGameStarted ? (
        <GameProcess
          myShips={myShips}
          myShots={myShots}
          opponentShips={opponentShips}
          opponentShots={opponentShots}
          isMyTurn={isMyTurn}
          winner={winner}
          shoot={shoot}
        />
      ) : (
        <GamePreparation submitShips={submitShips} isWaiting={isWaiting} />
      )}
    </main>
  );
};

export default Game;
