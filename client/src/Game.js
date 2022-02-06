import Field from "./Field";

const Game = ({ user, opponent }) => {
  return (
    <div className="gameBox">
      <Field />
      <Field />
    </div>
  );
}
 
export default Game;