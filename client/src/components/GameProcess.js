import { getShipsDivs, getPartsImgs } from "../utils/getShipsDivs";

const GameProcess = (props) => {
  const myCells = new Array(100)
    .fill()
    .map((val, i) => <div key={i} className="game-field-cell"></div>);

  const handleClick = (index) => {
    const x = index % 10;
    const y = Math.floor(index / 10);
    props.shoot({ x, y });
  };

  const opponentCells = new Array(100)
    .fill()
    .map((val, i) => (
      <div
        key={i}
        className="game-field-cell"
        onClick={props.isMyTurn ? () => handleClick(i) : null}
      ></div>
    ));

  const myShotsImgs = props.myShots.map((shot, index) => {
    const style = {
      top: `${shot.y * 60}px`,
      left: `${shot.x * 60}px`,
    };
    return (
      <img
        key={index}
        alt="shot"
        className="game-field-shot"
        src={shot.imgSrc}
        style={style}
      ></img>
    );
  });

  const opponentShotsImgs = props.opponentShots.map((shot, index) => {
    const style = {
      top: `${shot.y * 60}px`,
      left: `${shot.x * 60}px`,
    };
    return (
      <img
        key={index}
        alt="shot"
        className="game-field-shot"
        src={shot.imgSrc}
        style={style}
      ></img>
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
          {opponentShotsImgs}
        </div>
        <div className="game-field">
          {opponentCells}
          {getPartsImgs(props.opponentShips)}
          {myShotsImgs}
        </div>
      </div>
    </div>
  );
};

export default GameProcess;
