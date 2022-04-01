import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import useLocalStorage from "./hooks/useLocalStorage";
import Game from "./components/Game";

function App() {
  const [username, setUsername] = useLocalStorage("username", "");

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Login username={username} setUsername={setUsername} />}
        />
        <Route path="/home" element={<Home username={username} />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;
