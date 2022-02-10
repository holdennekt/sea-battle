import { io } from "socket.io-client";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import PlayersOnlineList from "./PlayersOnlineList";
import { defs, User, PlayersArray } from "./defs";
import Authorise from "./Authorise";
import InviteDialog from "./InviteDialog";
import Game from "./Game";

function App() {
  
  const [playersOnline, setPlayersOnline] = useState(new PlayersArray());
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteFrom, setInviteFrom] = useState(null);
  const navigate = useNavigate();

  const userRef = useRef(new User());             //try const user = useRef(new User()).current;
  const user = userRef.current;
  const [username, setUsername] = useState(undefined);
  // const socket = io(defs.url(), { autoConnect: false });
  const socketRef = useRef(null);
  const socket = socketRef.current;

  useEffect(() => {
    const sessionIdFromStorage = localStorage.getItem('sessionId');
    const usernameFromStorage = localStorage.getItem('username');
    console.log({ sessionIdFromStorage, usernameFromStorage });
    if (!sessionIdFromStorage) return;
    alert('fromLocalStorage');
    user.sessionId = sessionIdFromStorage;
    user.username = usernameFromStorage;
    socketRef.current = io(defs.url(), { auth: { user } });
    setupListeners(socketRef);
    navigate('/players');
  }, []);

  useEffect(() => {
    if (!username) return;

    socketRef.current.disconnect();
    socketRef.current = io(defs.url(), { auth: { user } });
    setupListeners(socketRef);

    return () => {
      socketRef.current.disconnect();
    }
  }, [username]);

  const onEnterHandler = (event) => {
    const value = event.target.value;
    if (value.length < defs.MIN_USERNAME_LENGTH) {
      const err = new Error('invalid username: way too short, min length:' + defs.MIN_USERNAME_LENGTH);
      console.log(err);
      //make normal UI error
      return err;
    }
    setUsername(value);
    user.username = value;
    navigate('/players');
  };

  const inviteble = (player, socket) => {
    player.invite = () => {
      console.log(`${user.username} invites ${player.username}`);
      socket.emit('inviteGame', player);
    };
    return player;
  };

  const startNewGame = (opponent) => {
    user.inGame = true;
    navigate('/game');
  };

  const setupListeners = (socketRef) => {
    socketRef.current.on('session', ({ sessionId, userId }) => {
      user.sessionId = sessionId;
      user.userId = userId;
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('username', user.username);
    });
  
    socketRef.current.on('inviteGame', (from) => {
      from.onAccept = () => {
        socketRef.current.emit('acceptGame', from);
        setShowInviteDialog(false);
        startNewGame(from);
      };
      from.onReject = () => {
        socketRef.current.emit('rejectGame', from);
        setShowInviteDialog(false);
      };
      setInviteFrom(from);
      setShowInviteDialog(true);
    });
  
    socketRef.current.on('acceptGame', (from) => {
      startNewGame(from);
    });
  
    socketRef.current.on('rejectGame', (from) => {
  
      //"player {from.username} rejected your invite😥"
    });
  
    socketRef.current.onAny((event, ...args) => {
      console.log(event, args);
    });
  
    socketRef.current.on('players', (players) => {
      const wrapped = players.map((player) => inviteble(player, socketRef.current));
      wrapped.forEach(player => playersOnline.add(player));
      setPlayersOnline(playersOnline.copy());
    });
  
    socketRef.current.on('new player', (player) => {
      playersOnline.add(inviteble(player, socketRef.current));
      console.log(playersOnline);
      setPlayersOnline(playersOnline.copy());
    });
  
    socketRef.current.on('player disconnected', (player) => {
      playersOnline.delete(player);
      setPlayersOnline(playersOnline.copy());
    });
  }

  return (
    <div className="App">
      <Link to='/'>Home</Link>
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
