const InviteDialog = ({ show, from }) => {

  if (!show) return (<></>);

  return (
    <div className="inviteBox">
      <p className="inviteMessage">{`${from.username} wants to play with you!`}</p>
      <button className="accept" onClick={from.onAccept}>Accept</button>
      <button className="reject" onClick={from.onReject}>Reject</button>
    </div>
  );
};

export default InviteDialog;