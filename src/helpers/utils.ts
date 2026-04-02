import type { Task } from "./type";

export const getListDataFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveListDataToLocalStorage = (key: string, data: Task[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};
