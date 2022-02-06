import { io } from "socket.io-client";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import PlayersOnlineList from "./PlayersOnlineList";
import { defs, User, PlayersArray } from "./defs";
import Authorise from "./Authorise";
import InviteDialog from "./InviteDialog";
import Game from "./Game";

function App() {

  const socket = io(defs.url(), { autoConnect: false });
  const user = new User();
  const [playersOnline, setPlayersOnline] = useState(new PlayersArray());
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteFrom, setInviteFrom] = useState(null);
  const navigate = useNavigate()

  const onEnterHandler = (event) => {
    const username = event.target.value;
    if (username.length < defs.MIN_USERNAME_LENGTH) {
      const err = new Error('invalid username: way too short, min length:' + defs.MIN_USERNAME_LENGTH);
      console.log(err);
      //make normal UI error
      return err;
    }
    user.username = username;
    socket.auth = user;
    socket.connect();
  };

  const inviteble = (player) => {
    player.invite = () => {
      console.log(`${user.username} invites ${player.username}`);
      socket.emit('inviteGame', player);
    };
    return player;
  };

  const startNewGame = (opponent) => {
    user.inGame = true;
    opponent.inGame = true;
    setInviteFrom(opponent);
    navigate('/game');
  };

  socket.on('inviteGame', (from) => {
    from.onAccept = () => {
      socket.emit('acceptGame', from);
      setShowInviteDialog(false);
      startNewGame(from);
    };
    from.onReject = () => {
      socket.emit('rejectGame', from);
      setShowInviteDialog(false);
    };
    setInviteFrom(from);
    setShowInviteDialog(true);
  });

  socket.on('acceptGame', (from) => {
    startNewGame(from);
  });

  socket.on('rejectGame', (from) => {

    //"player {from.username} rejected your invite😥"
  });

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  socket.on('players', (players) => {
    const wrapped = players.map((player) => inviteble(player));
    playersOnline.push(...wrapped);
    setPlayersOnline(playersOnline.copy());
  });

  socket.on('new player', (player) => {
    playersOnline.push(inviteble(player));
    setPlayersOnline(playersOnline.copy());
  });

  socket.on('player disconnected', (player) => {
    playersOnline.delete(player);
    setPlayersOnline(playersOnline.copy());
  });

  return (
    <div className="App">
      <Link to="/">Home</Link>
      <Routes>
        <Route exact path="/" element={
          <Authorise onEnterHandler={onEnterHandler}/>
        }/>
        <Route exact path="/players" element={
          <div>
            <PlayersOnlineList players={playersOnline}/>
            <InviteDialog 
              show={showInviteDialog}
              from={inviteFrom}
            />
          </div>
        }/>
        <Route exact path="/game" element={
          <Game user={user} opponent={inviteFrom}/>
        }/>
      </Routes>
    </div>
  );
}

export default App;
