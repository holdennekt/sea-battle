import { getShipsDivs, getPartsImgs } from "../utils/getShipsDivs";
import Confetti from "react-confetti";
import useLocalStorage from "../hooks/useLocalStorage";

const GameProcess = (props) => {
  const userId = useLocalStorage("userId");

  const handleClick = (index) => {
    const x = index % 10;
    const y = Math.floor(index / 10);
    props.shoot({ x, y });
  };

  const myCells = new Array(100).fill().map((val, i) => {
    const shot = props.opponentShots.find((shot) => shot.y * 10 + shot.x === i);
    const style = shot && {
      backgroundImage: `url(${shot.imgSrc})`,
      backgroundSize: "60px 60px",
    };
    return <div key={i} className="game-field-cell" style={style}></div>;
  });

  const opponentCells = new Array(100).fill().map((val, i) => {
    const shot = props.myShots.find((shot) => shot.y * 10 + shot.x === i);
    const style = shot && {
      backgroundImage: `url(${shot.imgSrc})`,
      backgroundSize: "60px 60px",
    };
    return (
      <div
        key={i}
        className="game-field-cell"
        onClick={props.isMyTurn ? () => handleClick(i) : null}
        style={style}
      ></div>
    );
  });

  return (
    <div className="game-process-container">
      <p className="waiting-for-opponent">
        {props.isMyTurn
          ? "Your turn to shoot!"
          : "Waiting for opponent to shoot"}
      </p>
      <div className="game-fields-container">
        <div className="game-field">
          {myCells}
          {getShipsDivs(props.myShips)}
        </div>
        <div className="game-field">
          {opponentCells}
          {getPartsImgs(props.opponentShips)}
        </div>
      </div>
      {props.winner && (
        <h1 className="game-winner">Winner is {props.winner.username}</h1>
      )}
      {props.winner && props.winner.userId === userId && <Confetti />}
    </div>
  );
};

export default GameProcess;
