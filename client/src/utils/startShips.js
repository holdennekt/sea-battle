import nose from "../images/part-1.png";
import middle from "../images/part-2.png";
import tail from "../images/part-3.png";

const startShips = [
  {
    isVertical: false,
    x: 0,
    y: 0,
    isAlive: true,
    length: 4,
    id: "1-quadruple",
    parts: [
      { x: 0, y: 0, isAlive: true, imgSrc: tail, rotation: 0 },
      {
        x: 1,
        y: 0,
        isAlive: true,
        imgSrc: middle,
        rotation: 0,
      },
      {
        x: 2,
        y: 0,
        isAlive: true,
        imgSrc: middle,
        rotation: 0,
      },
      { x: 3, y: 0, isAlive: true, imgSrc: nose, rotation: 0 },
    ],
  },
  {
    isVertical: false,
    x: 5,
    y: 0,
    isAlive: true,
    length: 3,
    id: "1-triple",
    parts: [
      { x: 0, y: 0, isAlive: true, imgSrc: tail, rotation: 0 },
      {
        x: 1,
        y: 0,
        isAlive: true,
        imgSrc: middle,
        rotation: 0,
      },
      { x: 2, y: 0, isAlive: true, imgSrc: nose, rotation: 0 },
    ],
  },
  {
    isVertical: false,
    x: 0,
    y: 2,
    isAlive: true,
    length: 3,
    id: "2-triple",
    parts: [
      { x: 0, y: 0, isAlive: true, imgSrc: tail, rotation: 0 },
      {
        x: 1,
        y: 0,
        isAlive: true,
        imgSrc: middle,
        rotation: 0,
      },
      { x: 2, y: 0, isAlive: true, imgSrc: nose, rotation: 0 },
    ],
  },
  {
    isVertical: false,
    x: 4,
    y: 2,
    isAlive: true,
    length: 2,
    id: "1-double",
    parts: [
      { x: 0, y: 0, isAlive: true, imgSrc: tail, rotation: 0 },
      { x: 1, y: 0, isAlive: true, imgSrc: nose, rotation: 0 },
    ],
  },
  {
    isVertical: false,
    x: 7,
    y: 2,
    isAlive: true,
    length: 2,
    id: "2-double",
    parts: [
      { x: 0, y: 0, isAlive: true, imgSrc: tail, rotation: 0 },
      { x: 1, y: 0, isAlive: true, imgSrc: nose, rotation: 0 },
    ],
  },
  {
    isVertical: false,
    x: 0,
    y: 4,
    isAlive: true,
    length: 2,
    id: "3-double",
    parts: [
      { x: 0, y: 0, isAlive: true, imgSrc: tail, rotation: 0 },
      { x: 1, y: 0, isAlive: true, imgSrc: nose, rotation: 0 },
    ],
  },
  {
    x: 3,
    y: 4,
    isAlive: true,
    length: 1,
    id: "1-single",
    parts: [{ x: 0, y: 0, isAlive: true, imgSrc: nose, rotation: 0 }],
  },
  {
    x: 5,
    y: 4,
    isAlive: true,
    length: 1,
    id: "2-single",
    parts: [{ x: 0, y: 0, isAlive: true, imgSrc: nose, rotation: 0 }],
  },
  {
    x: 7,
    y: 4,
    isAlive: true,
    length: 1,
    id: "3-single",
    parts: [{ x: 0, y: 0, isAlive: true, imgSrc: nose, rotation: 0 }],
  },
  {
    x: 9,
    y: 4,
    isAlive: true,
    length: 1,
    id: "4-single",
    parts: [{ x: 0, y: 0, isAlive: true, imgSrc: nose, rotation: 0 }],
  },
];

const ships = startShips.map((ship) => {
  const parts = ship.parts.map((part) => ({ ...part, parentId: ship.id }));
  return { ...ship, parts };
});

export default ships;
