import clone from "nodemon/lib/utils/clone";
import { useState } from "react";
import { getShipsDivs } from "../utils/getShipsDivs";
import {
  isShipPositionValid,
  getRotated,
  getRandomPlacement,
} from "../utils/shipsPlacementFuncs";
import startShips from "../utils/startShips";

const Preparation = ({ submitShips, isWaiting }) => {
  const [ships, setShips] = useState(() => getRandomPlacement(startShips));
  const [currentShipIndex, setCurrentShipIndex] = useState(-1);

  const placeOnCell = (index) => {
    if (currentShipIndex < 0 || currentShipIndex > 9) return;
    const clonedShips = clone(ships);
    const ship = clonedShips[currentShipIndex];
    ship.x = index % 10;
    ship.y = Math.floor(index / 10);
    if (isShipPositionValid(ship, clonedShips)) setShips(clonedShips);
    setCurrentShipIndex(-1);
  };

  const cells = new Array(100)
    .fill()
    .map((val, i) => (
      <div
        key={i}
        className="game-field-cell"
        onClick={() => placeOnCell(i)}
      ></div>
    ));

  const rotate = () => {
    if (currentShipIndex < 0 || currentShipIndex > 9) return;
    const newShips = ships.map((ship, index) =>
      currentShipIndex === index ? getRotated(ship) : ship
    );
    if (isShipPositionValid(currentShipIndex, newShips)) setShips(newShips);
  };

  return (
    <div className="preparation-container">
      {isWaiting && (
        <p className="waiting-for-opponent">Waiting for opponent to be ready</p>
      )}
      <div className="game-field">
        {cells}
        {getShipsDivs(ships, currentShipIndex, setCurrentShipIndex)}
      </div>
      <div className="preparation-buttons-container">
        <button className="preparation-button" onClick={() => rotate()}>
          Rotate
        </button>
        <button
          className="preparation-button"
          onClick={() => setShips(getRandomPlacement(startShips))}
        >
          Place ships randomly
        </button>
        <button
          className="preparation-button"
          onClick={() => submitShips(ships)}
        >
          Start the Game!
        </button>
      </div>
    </div>
  );
};

export default Preparation;
