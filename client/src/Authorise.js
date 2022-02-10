import { defs } from "./defs";

const Authorise = ({ onEnterHandler }) => {

  const onKeyDownHandler = (e) => {
    if (e.code === defs.CODE_ENTER) {
      onEnterHandler(e);
    }
  }

  return (
    <div className="authorise">
      <label>Enter username:</label>
      <input
      type="text"
      placeholder="username"
      onKeyDown={onKeyDownHandler}
      required
      />
    </div>
  );
};
 
export default Authorise;