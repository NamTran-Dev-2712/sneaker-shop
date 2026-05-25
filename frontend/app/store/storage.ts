import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// use local storage if available, otherwise use in-memory storage
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// session storage for checkout data (cleared when browser tab closes)
export const sessionStorage =
  typeof window !== "undefined"
    ? createWebStorage("session")
    : createNoopStorage();

export default storage;
