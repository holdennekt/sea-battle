import useGame from "../hooks/useGame";
import GamePreparation from "./GamePreparation";
import GameProcess from "./GameProcess";

const Game = ({ opponent, gameId, endGame }) => {
  // console.log(opponent);
  const {
    isGameStarted,
    myShips,
    myShots,
    opponentShips,
    opponentShots,
    isMyTurn,
    isWaiting,
    submitShips,
    shoot,
  } = useGame(opponent, gameId, endGame);
  // setTimeout(endGame, 5000);

  return (
    <main className="game-container">
      {isGameStarted ? (
        <GameProcess
          myShips={myShips}
          myShots={myShots}
          opponentShips={opponentShips}
          opponentShots={opponentShots}
          isMyTurn={isMyTurn}
          shoot={shoot}
        />
      ) : (
        <GamePreparation submitShips={submitShips} isWaiting={isWaiting} />
      )}
    </main>
  );
};

export default Game;
