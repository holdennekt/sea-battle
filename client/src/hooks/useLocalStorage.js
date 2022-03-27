import { useState, useEffect } from "react";

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    const item = JSON.stringify(value);
    localStorage.setItem(key, item);
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
