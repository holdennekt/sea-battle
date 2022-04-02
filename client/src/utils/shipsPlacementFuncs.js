const getShipsByIndexes = (ships) => {
  const shipsByIndexes = {};
  // заповнюю об'єкт ключами, що є одновимірніми координатами частинкок корабля
  for (const ship of ships) {
    for (const part of ship.parts) {
      const index100 = (ship.y + part.y) * 10 + ship.x + part.x;
      shipsByIndexes[index100] = true;
    }
  }
  return shipsByIndexes;
};

const normalize = (index) => {
  const normalized = index < 0 ? 0 : index;
  return normalized > 9 ? 9 : normalized;
};

const getCoords = (parts) => {
  const firstPart = parts[0];
  const lastPart = parts[parts.length - 1];
  // отримання координат верхньої лівої і нижньої правої
  // точок прямокутника, у якому треба шукати інші кораблі
  const startI = normalize(firstPart.y - 1);
  const startJ = normalize(firstPart.x - 1);
  const endI = normalize(lastPart.y + 1);
  const endJ = normalize(lastPart.x + 1);
  return { startI, startJ, endI, endJ };
};

const isShipPositionValid = (ship, ships) => {
  // перевірка чи не вийшов корабель за межі поля
  const shipIndexes = [];
  for (const part of ship.parts) {
    shipIndexes.push({ x: ship.x + part.x, y: ship.y + part.y });
  }
  const isOutOfBoundaries = shipIndexes.some((obj) =>
    Object.values(obj).some((i) => i > 9 || i < 0)
  );
  if (isOutOfBoundaries) return false;
  // об'єкт, де ключі це одновимірні координати частинок кораблів
  const shipsByIndexes = getShipsByIndexes(ships);
  // для зручності отримую масив з одновимірних індексів своїх же частинок корабля
  const shipIndexes100 = shipIndexes.map((part) => part.y * 10 + part.x);
  // отримання координат верхньої лівої і нижньої правої
  // точок прямокутника, у якому треба шукати інші кораблі
  const { startI, startJ, endI, endJ } = getCoords(shipIndexes);
  // ітерація і перевірка чи є інші кораблі у цьому прямокутнику
  for (let i = startI; i <= endI; i++) {
    for (let j = startJ; j <= endJ; j++) {
      // для зручності отримую одновимірний індекс клітинки, що перевіряю
      const index100 = i * 10 + j;
      // якщо ця клітинка належить самому кораблю, то її треба пропустити
      if (shipIndexes100.some((index) => index === index100)) continue;
      // якщо у раніше отриманому об'єкті на цьому індексі
      // є частинка корабля, то така позиція неможлива
      if (shipsByIndexes[index100]) return false;
    }
  }
  // якщо усі клітинки виявились або своїми, або пустими, то позиція можлива
  return true;
};

const getRotated = (ship) => {
  const rotatedParts = ship.parts.map((part) => ({
    ...part,
    y: part.x,
    x: part.y,
    rotation: part.rotation === 0 ? 90 : 0,
  }));
  const rotated = {
    ...ship,
    parts: rotatedParts,
    isVertical: !ship.isVertical,
  };
  return rotated;
};

const getPositionsForShip = (ship, ships) => {
  const validPositions = [];
  const shipsByIndexes = getShipsByIndexes(ships);
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const index100 = i * 10 + j;
      if (shipsByIndexes[index100]) continue;
      const position = { ...ship, x: j, y: i };
      if (j > 10 - position.length) continue;
      if (isShipPositionValid(position, ships)) {
        validPositions.push(position);
      }
      const rotatedPosition = getRotated(position);
      if (i > 10 - rotatedPosition.length) continue;
      if (isShipPositionValid(rotatedPosition, ships)) {
        validPositions.push(rotatedPosition);
      }
    }
  }
  return validPositions;
};

const getRandomPlacement = (ships) => {
  const placed = [];
  for (const ship of ships) {
    const positions = getPositionsForShip(ship, placed);
    const randomIndex = Math.floor(Math.random() * positions.length);
    const randomPosition = positions[randomIndex];
    placed.push(randomPosition);
  }
  return placed;
};

export { getCoords, isShipPositionValid, getRotated, getRandomPlacement };
