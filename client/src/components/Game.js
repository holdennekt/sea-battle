const Game = (props) => {
  setTimeout(props.endGame, 5000);
  return <main className="game-container"></main>;
};

export default Game;
