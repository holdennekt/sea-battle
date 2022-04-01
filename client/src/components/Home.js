import { useNavigate } from "react-router-dom";
import Game from "./Game";
import Players from "./Players";
import Logo from "../images/seabattle-logo.jpeg";
import { useState } from "react";

const Home = ({ username }) => {
  const [game, setGame] = useState({ isStarted: false });

  const navigate = useNavigate();

  const startGame = (opponent, gameId) => {
    setGame({
      isStarted: true,
      opponent,
      gameId,
    });
  };

  const endGame = () => {
    setGame({ isStarted: false });
  };

  return (
    <div className="home-container">
      <nav>
        <img className="nav-icon" src={Logo} alt="SeaBattle logo here" />
        <p className="nav-icon-title">SeaBattle</p>
        <p className="nav-username">{username}</p>
        <p className="nav-edit-username-button" onClick={() => navigate("/")}>
          Edit
        </p>
      </nav>
      {game.isStarted ? (
        <Game opponent={game.opponent} gameId={game.gameId} endGame={endGame} />
      ) : (
        <Players startGame={startGame} />
      )}
    </div>
  );
};

export default Home;
