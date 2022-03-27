import { useNavigate } from "react-router-dom";
import Game from "./Game";
import Players from "./Players";
import Logo from "../images/seabattle-logo.jpeg";
import { useState } from "react";
import useSocket from "../hooks/useSocket";

const Home = ({ username }) => {
  const [game, setGame] = useState({ isStarted: false });
  const navigate = useNavigate();

  const startGame = (opponent) => {
    setGame({
      isStarted: true,
      opponent
    });
  };

  const { users, sendInvite, cancelInvite, rejectInvite, acceptInvite } = useSocket(startGame);

  return (
    <div className="home-container">
      <nav>
        <img className="nav-icon" src={Logo} alt="SeaBattle logo here"/>
        <p className="nav-icon-title">SeaBattle</p>
        <p className="nav-username">{username}</p>
        <p
          className="nav-edit-username-button"
          onClick={() => navigate('/')}>
          Edit
        </p>
      </nav>
      {
        game.isStarted
        ?
        <Game opponent={game.opponent} />
        :
        <Players
          players={users}
          sendInvite={sendInvite}
          cancelInvite={cancelInvite}
          rejectInvite={rejectInvite}
          acceptInvite={acceptInvite}
        />
      }
    </div>
  );
};
 
export default Home;
