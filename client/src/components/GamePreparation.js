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
  const [currentShipId, setCurrentShipId] = useState("");

  const placeOnCell = (index) => {
    if (currentShipId < 0 || currentShipId > 9) return;
    const clonedShips = clone(ships);
    const ship = clonedShips.find((ship) => ship.id === currentShipId);
    ship.x = index % 10;
    ship.y = Math.floor(index / 10);
    if (isShipPositionValid(ship, clonedShips)) setShips(clonedShips);
    setCurrentShipId("");
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
    if (currentShipId < 0 || currentShipId > 9) return;
    const ship = ships.find((ship) => ship.id === currentShipId);
    const newShips = ships.map((ship) =>
      ship.id === currentShipId ? getRotated(ship) : ship
    );
    if (isShipPositionValid(ship, newShips)) setShips(newShips);
  };

  return (
    <div className="preparation-container">
      {isWaiting && (
        <p className="waiting-for-opponent">Waiting for opponent to be ready</p>
      )}
      <div className="game-field">
        {cells}
        {getShipsDivs(ships, currentShipId, setCurrentShipId)}
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
