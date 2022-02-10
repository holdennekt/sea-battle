const PlayersOnlineList = ({ players }) => {
  return players.length > 0 ? (
    <div className="players">
      <h2>Players</h2>
      {players.map((player) => (
        <div className="player" id={player.userId} key={player.userId}>
          <label className="playerName">{player.username}</label>
          <p className="playerStatus">{player.inGame ? "playing" : "chilling"}</p>
          <button className="invite" onClick={player.invite}>Invite</button>
        </div>
      ))}
    </div>
  ) : (
    <div className="players">
      <h2 className="noPlayers">No one is online😪</h2>
    </div>
  );
};
 
export default PlayersOnlineList;
