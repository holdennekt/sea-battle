import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ username, setUsername }) => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    const trimmed = username.trim();
    if (trimmed.length > 2) {
      setUsername(trimmed);
      setError(false);
      localStorage.setItem('username', JSON.stringify(trimmed));
      navigate('/home');
    } else setError(true);
  }
  return (
    <div className="login-box">
      <input
        className="login-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your username goes here..."
        spellCheck="false"
      />
      {error && <h2 className="login-error">Username must be at least 3 character long</h2>}
      <button
        className="login-button"
        onClick={handleClick}>
          Confirm
      </button>
    </div>
  );
}
 
export default Login;