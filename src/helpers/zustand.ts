import type { Task } from "@/helpers/type";
import { create } from "zustand";

type AppStoreType = {
  dataTasks: Task[];
  setDataTasks: (data: Task[]) => void;
};

export const useAppStore = create<AppStoreType>((set) => ({
  dataTasks: [],
  setDataTasks: (data: Task[]) => set({ dataTasks: data }),
}));
