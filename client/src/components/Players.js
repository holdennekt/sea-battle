import usePlayers from "../hooks/usePlayers";

const Players = ({ startGame }) => {
  const { users, sendInvite, cancelInvite, rejectInvite, acceptInvite } =
    usePlayers(startGame);

  const players = users.map((player) => {
    let buttonsKeeper;
    if (player.invitedMe) {
      buttonsKeeper = (
        <div className="player-buttons">
          <button
            className="player-accept-button"
            onClick={() => acceptInvite(player.userId)}
          >
            Accept
          </button>
          <button
            className="player-reject-button"
            onClick={() => rejectInvite(player.userId)}
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
            onClick={() => cancelInvite(player.userId)}
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
            onClick={player.inGame ? null : () => sendInvite(player.userId)}
          >
            Invite
          </button>
        </div>
      );

    return (
      <div className="player" key={player.userId}>
        <p className="player-username">{player.username}</p>
        <p className="player-status">
          {player.inGame
            ? `in game with ${player.opponent.username}`
            : "in lobby"}
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
