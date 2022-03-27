import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import useLocalStorage from "./useLocalStorage";

const SERVER_URL = "http://localhost:8000";

const test = [
  { username: 'Nikita', userId: 'jfgbvyebghjvj236'},
  { username: 'Pashka', userId: ';utbcwhgvr24ut' },
  { username: 'Vova', userId: 'tyeuybclgkhv52' },
  { username: 'Danik', userId: 'fgahsjgbhsgvfq2' },
  { username: 'Manzos', userId: 'qwrtw ehekbyte2' },
  { username: 'Bohdan', userId: 'w9p877gggbwe' },
  { username: 'Sanyok', userId: '3562vjdgbldsejb'},
];

const useSocket = (startGame) => {
  // локальний стан гравців онлайн
  const [users, setUsers] = useState([]);
  // локальний стан усіх надісланих запрошень і тіх, що надійшли до користувача
  const [sentInvites, setSentInvites] = useState([]); // масив userId
  const [recievedInvites, setReceivedInvites] = useState([]); // масив userId

  // отримуємо username
  // const username = localStorage.getItem('username');
  const [username] = useLocalStorage('username');

  // створюємо посилання сокету
  const socketRef = useRef(null);

  // функція відправлення запрошення
  const sendInvite = (toUserId) => {
    // відправка повідомлення
    socketRef.current.emit('invite:send', toUserId);
    // додаємо в масив активних відправлених запрошень
    setSentInvites(oldInvites => [...oldInvites, toUserId]);
  };

  // функція відміни відправлення запрошення
  const cancelInvite = (toUserId) => {
    // відправка повідомлення
    socketRef.current.emit('invite:cancel', toUserId);
    // вилучаємо з масиву активних відправлених запрошень
    setSentInvites(oldInvites => oldInvites.filter(invite => invite !== toUserId));
  };

  // функція відхилення запрошення
  const rejectInvite = (fromUser) => {
    // відправка повідомлення
    socketRef.current.emit('invite:reject', fromUser);
    // вилучаємо з масиву активних отриманих запрошень
    setReceivedInvites(oldInvites => oldInvites.filter(invite => invite !== fromUser));
  };

  // функція прийняття запрошення
  const acceptInvite = (fromUser) => {
    // відправка повідомлення
    socketRef.current.emit('invite:accept', fromUser);
    // відміна всіх відправлених запрошень
    for (const toUserId of sentInvites) {
      cancelInvite(toUserId);
    }
    // оновлення масиву відправлених запрошень
    setSentInvites([]);
    // відхилення всіх отриманих запрошень
    for (const fromUser of recievedInvites) {
      rejectInvite(fromUser);
    }
    // оновлення масиву отриманих запрошень
    setReceivedInvites([]);
    // далі має починатися гра...............................................................
    const opponent = users.find(user => user.userId === fromUser);
    startGame(opponent);
  };

  useEffect(() => {
    // створюємо екземпляр сокету і записуємо id кімнати
    socketRef.current = io(SERVER_URL, { query: { username } });

    // обробник надходжених користувачів онлайн
    // ця подія буде надходити у разі, якщо під'єднається новий користувач або від'єднається старий
    socketRef.current.on('users', (users) => {
      // оновлюємо масив
      setUsers(users);
    });

    socketRef.current.on('user:connected', (user) => {
      // оновлюємо масив
      setUsers(oldUsers => [user, ...oldUsers]);
    });

    socketRef.current.on('user:disconnected', (user) => {
      // оновлюємо масив
      setUsers(oldUsers => oldUsers.filter(usr => usr.userId !== user.userId));
    });

    // обробник отриманого запрошення
    socketRef.current.on('invite:send', (fromUser) => {
      // оновлюємо масив
      setReceivedInvites(oldInvites => [fromUser, ...oldInvites]);
    });

    // обробник відміненого запрошення
    socketRef.current.on('invite:cancel', (fromUser) => {
      // оновлюємо масив
      setReceivedInvites(oldInvites => oldInvites.filter(invite => invite !== fromUser));
    });

    // обробник прийнятого запрошення
    socketRef.current.on('invite:accept', (toUserId) => {
      // відміна всіх відправлених запрошень
      for (const toUserId of sentInvites) {
        cancelInvite(toUserId);
      }
      // оновлення масиву відправлених запрошень
      setSentInvites([]);
      // відхилення всіх отриманих запрошень
      for (const fromUser of recievedInvites) {
        rejectInvite(fromUser);
      }
      // оновлення масиву отриманих запрошень
      setReceivedInvites([]);
      // далі має починатися гра...............................................................
      const opponent = users.find(user => user.userId === toUserId);
      startGame(opponent);
    });

    // обробник відхиленого запрошення
    socketRef.current.on('invite:reject', (toUserId) => {
      // оновлюємо масив
      setSentInvites(oldInvites => oldInvites.filter(invite => invite !== toUserId));
    });

    return () => {
      // при розмонтуванні компоненту відключаємо сокет
      socketRef.current.disconnect();
    };
  }, [username]);

  // коли змінюється масив відправлених запрошень,
  // треба змінити масив користувачів і додати деяким властивість iInvited
  useEffect(() => {
    setUsers(oldUsers => oldUsers.map(user => (
      { ...user, iInvited: sentInvites.some(invite => user.userId === invite) }
    )));
  }, [sentInvites])

  // коли змінюється масив отриманих запрошень,
  // треба змінити масив користувачів і додати деяким властивість invitedMe
  useEffect(() => {
    setUsers(oldUsers => oldUsers.map(user => (
      { ...user, invitedMe: recievedInvites.some(invite => user.userId === invite) }
    )));
    // якщо виникне ситуація, коли 2 користувачі одночасно відправлять запрошення
    // і одночасно отримають подію, то у двох будуть висіти вхідні/вихідні запрошення,
    // а також user.iInvited і user.invitedMe будуть одночасно true.
    // В такій ситуації потрібно одразу почати гру
    for (const user of users) {
      if (user.iInvited && user.invitedMe) {
        acceptInvite(user.userId);
      }
    }
  }, [recievedInvites]);

  // // отправляем на сервер событие "user:leave" перед перезагрузкой страницы ???????? хз нащо
  // useBeforeUnload(() => {
  //   socketRef.current.emit("user:leave", userId);
  // });

  // хук повертає користувачів онлайн, функції відправлення,
  // відміни відправлення, відхилення та прийняття запрошення
  return { users, sendInvite, cancelInvite, rejectInvite, acceptInvite };
};

export default useSocket;
