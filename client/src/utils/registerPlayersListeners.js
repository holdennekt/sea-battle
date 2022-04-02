const registerPlayersListeners = (...args) => {
  const [socket, users, setUsers, acceptInvite, startGame] = args;

  socket.onAny((...args) => {
    console.log("socket recieved event:", ...args);
  });

  // обробник надходжених користувачів онлайн
  socket.on("users", (users) => {
    // оновлення масиву користувачів
    setUsers(users);
  });

  // обробник підключення користувача
  socket.on("user:connected", (user) => {
    // оновлення масиву користувачів
    setUsers((oldUsers) => [user, ...oldUsers]);
  });

  // обробник відключення користувача
  socket.on("user:disconnected", (user) => {
    // оновлення масиву користувачів
    setUsers((oldUsers) =>
      oldUsers.filter((usr) => usr.userId !== user.userId)
    );
  });

  // обробник отриманого запрошення
  socket.on("invite:send", ({ fromUserId }) => {
    setUsers((oldUsers) => {
      const user = oldUsers.find((user) => user.userId === fromUserId);
      const filtered = oldUsers.filter((user) => user.userId !== fromUserId);
      return [{ ...user, invitedMe: true }, ...filtered];
    });
    // якщо обивда користувачі одночасно надішлють запрошення
    // і воно одночасно прибуде, то потрібно одразу запустити гру
    for (const user of users) {
      if (user.iInvited && user.invitedMe) {
        return acceptInvite(user.userId);
      }
    }
  });

  // обробник відміненого запрошення
  socket.on("invite:cancel", ({ fromUserId }) => {
    // оновлення масиву користувачів
    setUsers((oldUsers) =>
      oldUsers.map((user) =>
        user.userId === fromUserId ? { ...user, invitedMe: false } : user
      )
    );
  });

  // обробник прийнятого запрошення
  socket.on("invite:accept", ({ toUserId, gameId }) => {
    // відміна відправлених запрошень, відхилення отриманих запрошень
    // оновлення масиву користувачів
    setUsers((oldUsers) =>
      oldUsers.map((user) => {
        if (user.iInvited && user.userId !== toUserId)
          socket.emit("invite:cancel", { fromUser: user.userId });
        if (user.invitedMe)
          socket.emit("invite:reject", { fromUser: user.userId });
        return { ...user, invitedMe: false, iInvited: false };
      })
    );
    // об'єкт суперника
    const { username, userId } = users.find((user) => user.userId === toUserId);
    // далі має починатися гра
    startGame({ username, userId }, gameId);
  });

  // обробник відхиленого запрошення
  socket.on("invite:reject", ({ toUserId }) => {
    // оновлення масиву користувачів
    setUsers((oldUsers) =>
      oldUsers.map((user) =>
        user.userId === toUserId ? { ...user, iInvited: false } : user
      )
    );
  });

  socket.on("status:change", ({ fromUserId, inGame, inGameWith }) => {
    // оновлення масиву користувачів
    setUsers((oldUsers) =>
      oldUsers.map((user) =>
        user.userId === fromUserId ? { ...user, inGame, inGameWith } : user
      )
    );
  });
};

export default registerPlayersListeners;
