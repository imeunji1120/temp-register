// /src/utils/localStorage

// getter
export const getLocalStorage = (key) => {
  return JSON.parse(window.localStorage.getItem(key));
};

// setter
export const setLocalStorage = (key, val) => {
  window.localStorage.setItem(key, JSON.stringify(val));
};

// remove
export const removeLocalStorageItem = (key) => {
  window.localStorage.removeItem(key);
};

// remove all
export const removeAllLocalStorage = () => {
  window.localStorage.clear();
};

const fruits = {
  Apple: { id: 1, name: "Apple", src: "/img/apple.jpg" },
  Banana: { id: 2, name: "Banana", src: "/img/banana.jpg" },
  Orange: { id: 3, name: "Orange", src: "/img/orange.jpg" },
  Grape: { id: 4, name: "Grape", src: "/img/grape.jpg" },
};
