const Players = (props) => {
  console.log(props.players);
  const players = props.players.map(player => {
    let buttonsKeeper;
    if (player.invitedMe) {
      buttonsKeeper = (
        <div className="player-buttons">
            <button
              className="player-accept-button"
              onClick={() => props.acceptInvite(player.userId)}>
              Accept
            </button>
            <button
              className="player-reject-button"
              onClick={() => props.rejectInvite(player.userId)}>
              Reject
            </button>
          </div>
      );
    } else if (player.iInvited) {
      buttonsKeeper = (
        <div className="player-buttons">
          <button className="player-invited-button">Invited</button>
          <button
            className="player-cancel-button"
            onClick={() => props.cancelInvite(player.userId)}>
            Cancel
          </button>
        </div>
      );
    } else buttonsKeeper = (
      <button
        className="player-invite-button"
        onClick={() => props.sendInvite(player.userId)}>
        Invite
      </button>
    );

    return (
      <div className="player" key={player.userId}>
        <p className="player-username">{player.username}</p>
        {buttonsKeeper}
      </div>
    );
  });

  return (
    <main className="players-container">
      {
        players.length > 0 ?
        <div className="players-box">{players}</div> :
        <p className="players-no-online">No one is online😪</p>
      }
    </main>
  );
};
 
export default Players;