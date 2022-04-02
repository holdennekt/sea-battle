const getShipsDivs = (ships, currentShipIndex, setCurrentShipIndex) => {
  const shipsDivs = ships.map((ship, i) => {
    const shipImgs = ship.parts.map((part, j) => (
      <img
        key={j}
        alt="shipPart"
        className="game-ship-part"
        src={part.imgSrc}
        style={{ transform: `rotate(${part.rotation}deg)` }}
        draggable="false"
      />
    ));
    const style = {
      display: "flex",
      flexDirection: ship.isVertical ? "column" : "row",
      position: "absolute",
      top: `${(ship.y + ship.parts[0].y) * 60}px`,
      left: `${(ship.x + ship.parts[0].x) * 60}px`,
      backgroundColor: currentShipIndex === i ? "#6464ff" : "transparent",
    };
    return (
      <div
        key={i}
        className="game-ship-container"
        style={style}
        onClick={setCurrentShipIndex ? () => setCurrentShipIndex(i) : null}
      >
        {shipImgs}
      </div>
    );
  });
  return shipsDivs;
};

const getPartsImgs = (ships) => {
  const imgs = [];
  const parts = {};
  for (const ship of ships) {
    for (const part of ship.parts) {
      const index100 = part.y * 10 + part.x;
      parts[index100] = part;
    }
  }
  for (const key in parts) {
    const part = parts[key];
    const style = {
      position: "absolute",
      top: `${part.y * 60}px`,
      left: `${part.x * 60}px`,
      transform: `rotate(${part.rotation}deg)`,
    };
    const img = (
      <img
        key={key}
        alt="shipPart"
        className="game-ship-part"
        src={part.imgSrc}
        style={style}
        draggable="false"
      />
    );
    imgs.push(img);
  }
  return imgs;
};

export { getShipsDivs, getPartsImgs };
