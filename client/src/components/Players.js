const Players = (props) => {
  const players = props.players.map((player) => {
    let buttonsKeeper;
    if (player.invitedMe) {
      buttonsKeeper = (
        <div className="player-buttons">
          <button
            className="player-accept-button"
            onClick={() => props.acceptInvite(player.userId)}
          >
            Accept
          </button>
          <button
            className="player-reject-button"
            onClick={() => props.rejectInvite(player.userId)}
          >
            Reject
          </button>
        </div>
      );
    } else if (player.iInvited) {
      buttonsKeeper = (
        <div className="player-buttons">
          <button className="player-invite-disabled-button">Invited</button>
          <button
            className="player-cancel-button"
            onClick={() => props.cancelInvite(player.userId)}
          >
            Cancel
          </button>
        </div>
      );
    } else
      buttonsKeeper = (
        <div className="player-buttons">
          <button
            className={
              player.inGame
                ? "player-invite-disabled-button"
                : "player-invite-button"
            }
            onClick={player.inGame ? null : () => props.sendInvite(player.userId)}
          >
            Invite
          </button>
        </div>
      );

    return (
      <div className="player" key={player.userId}>
        <p className="player-username">{player.username}</p>
        <p className="player-status">
          {player.inGame ? `in game with ${player.inGameWith.username}` : "in lobby"}
        </p>
        {buttonsKeeper}
      </div>
    );
  });

  return (
    <main className="players-container">
      {players.length > 0 ? (
        <div className="players-box">{players}</div>
      ) : (
        <p className="players-no-online">No one is online😪</p>
      )}
    </main>
  );
};

export default Players;
