import { useNavigate } from "react-router-dom";
import { defs } from "./defs";

const Authorise = ({ onEnterHandler }) => {

  const navigate = useNavigate();

  const onKeyDownHandler = (e) => {
    if (e.code === defs.CODE_ENTER) {
      onEnterHandler(e);
      navigate('/players');
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