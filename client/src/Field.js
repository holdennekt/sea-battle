import React from "react";

const Field = () => {
  const arr = new Array(100).fill(1);
  return (
    <div className="field">
      {arr.map((val, index) => React.createElement('img', {
        src: 'boat.png',
        className:'fieldCell',
        id: index.toString(),
        key: index.toString()
      }))}
    </div>
  );
}
 
export default Field;