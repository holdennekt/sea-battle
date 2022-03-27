import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import registerHandlers from "./registerListeners";
import useLocalStorage from "./useLocalStorage";

const SERVER_URL = "http://localhost:8000";

const useSocket = (startGame) => {
  // локальний стан гравців онлайн і статусу їх запрошень
  const [users, setUsers] = useState([]);

  // отримуємо username
  const [username] = useLocalStorage("username");

  // створюємо посилання сокету
  const socketRef = useRef(null);

  // функція відправлення запрошення
  const sendInvite = (toUserId) => {
    // відправка повідомлення
    socketRef.current.emit("invite:send", { toUserId });
    // додаємо в масив активних відправлених запрошень
    setUsers((oldUsers) =>
      oldUsers.map((user) =>
        user.userId === toUserId ? { ...user, iInvited: true } : user
      )
    );
  };

  // функція відміни відправлення запрошення
  const cancelInvite = (toUserId) => {
    // відправка повідомлення
    socketRef.current.emit("invite:cancel", { toUserId });
    // вилучаємо з масиву активних відправлених запрошень
    setUsers((oldUsers) =>
      oldUsers.map((user) =>
        user.userId === toUserId ? { ...user, iInvited: false } : user
      )
    );
  };

  // функція відхилення запрошення
  const rejectInvite = (fromUserId) => {
    // відправка повідомлення
    socketRef.current.emit("invite:reject", { fromUserId });
    // вилучаємо з масиву активних отриманих запрошень
    setUsers((oldUsers) =>
      oldUsers.map((user) =>
        user.userId === fromUserId ? { ...user, invitedMe: false } : user
      )
    );
  };

  // функція прийняття запрошення
  const acceptInvite = useCallback(
    (fromUserId) => {
      // відправка повідомлення
      socketRef.current.emit("invite:accept", { fromUserId });
      // відміна відправлених запрошень, відхилення отриманих запрошень
      // оновлення масиву користувачів
      setUsers((oldUsers) =>
        oldUsers.map((user) => {
          if (user.iInvited)
            socketRef.current.emit("invite:cancel", { toUserId: user.userId });
          if (user.invitedMe && user.userId !== fromUserId)
            socketRef.current.emit("invite:reject", {
              fromUserId: user.userId,
            });
          return { ...user, invitedMe: false, iInvited: false };
        })
      );
      // об'єкт суперника
      const opponent = users.find((user) => user.userId === fromUserId);
      // зміна статусу на щось типу "у грі"
      socketRef.current.emit("status:change", {
        inGame: true,
        inGameWith: opponent,
      });
      // далі має починатися гра
      startGame(opponent);
    },
    [users, startGame]
  );

  useEffect(() => {
    // створюємо екземпляр сокету і записуємо username
    socketRef.current = io(SERVER_URL, { query: { username } });

    return () => {
      // при розмонтуванні компоненту відключаємо сокет
      socketRef.current.disconnect();
    };
  }, [username]);

  useEffect(() => {
    // видалення попередніх обробників
    socketRef.current.offAny();
    socketRef.current.removeAllListeners();

    // регістрація обробників подій
    registerHandlers(
      socketRef.current,
      users,
      setUsers,
      acceptInvite,
      startGame
    );
  }, [users, acceptInvite, startGame]);

  // хук повертає користувачів онлайн, функції відправлення,
  // відміни відправлення, відхилення та прийняття запрошення
  return { users, sendInvite, cancelInvite, rejectInvite, acceptInvite };
};

export default useSocket;
