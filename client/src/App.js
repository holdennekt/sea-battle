import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import { useEffect, useState } from "react";

function App() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const savedUsername = JSON.parse(localStorage.getItem("username"));
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Login username={username} setUsername={setUsername} />}
        />
        <Route path="/home" element={<Home username={username} />} />
      </Routes>
    </div>
  );
}

export default App;
