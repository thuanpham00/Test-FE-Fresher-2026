import { useEffect, useMemo, useState } from "react";
import { getListDataFromLocalStorage, saveListDataToLocalStorage } from "./helpers/utils";
import { sampleTasks } from "./helpers/data";
import { TaskCard } from "./components/TaskCard";
import AddCard from "@/components/AddCard";
import { useAppStore } from "@/helpers/zustand";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type SearchTaskType } from "@/schemaValidation/task";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskPriority, TaskStatus } from "@/helpers/type";

function App() {
  const dataTasks = useAppStore((state) => state.dataTasks);
  const setDataTasks = useAppStore((state) => state.setDataTasks);

  useEffect(() => {
    const dataFromLocalStorage = getListDataFromLocalStorage("tasks");
    if (dataFromLocalStorage.length === 0) {
      saveListDataToLocalStorage("tasks", sampleTasks);
      setDataTasks(sampleTasks);
    } else {
      setDataTasks(dataFromLocalStorage);
    }
  }, [setDataTasks]);

  const doneCount = dataTasks.filter((task) => task.status === "Done").length;
  const inProgressCount = dataTasks.filter((task) => task.status === "In Progress").length;
  const todoCount = dataTasks.filter((task) => task.status === "To Do").length;

  const [typeSort, setTypeSort] = useState<"deadline" | "created" | "normal">("normal");
  const [filters, setFilters] = useState<SearchTaskType>({});

  const handleFilterList = (field: keyof SearchTaskType, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const visibleList = useMemo(() => {
    let list = [...dataTasks];
    if (typeSort === "deadline") {
      list = list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (typeSort === "created") {
      list = list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      list = getListDataFromLocalStorage("tasks");
    }
    if (filters.title) {
      list = list.filter((task) => task.title.toLowerCase().includes(filters.title!.toLowerCase()));
    }
    if (filters.priority) {
      list = list.filter((task) => task.priority === filters.priority);
    }
    if (filters.status) {
      list = list.filter((task) => task.status === filters.status);
    }
    return list;
  }, [dataTasks, typeSort, filters]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="rounded-2xl bg-blue-500 p-6 text-slate-100 shadow-xl sm:p-8">
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Todo Dashboard</h1>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white bg-red-500 p-4">
              <p className="text-base uppercase tracking-wider font-semibold text-white">To Do</p>
              <p className="mt-1 text-2xl font-semibold">{todoCount}</p>
            </div>
            <div className="rounded-xl border border-white bg-yellow-500 p-4">
              <p className="text-base uppercase tracking-wider font-semibold text-white">In Progress</p>
              <p className="mt-1 text-2xl font-semibold text-white">{inProgressCount}</p>
            </div>
            <div className="rounded-xl border border-white bg-green-500 p-4">
              <p className="text-base uppercase tracking-wider font-semibold text-white">Done</p>
              <p className="mt-1 text-2xl font-semibold text-white">{doneCount}</p>
            </div>
          </div>
        </section>

        <section className="flex justify-between items-center bg-gray-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 w-3/4 flex-wrap">
            <div className="flex items-center gap-2">
              <div>Sort</div>
              <Select
                onValueChange={(value) => setTypeSort(value as "deadline" | "created" | "normal")}
                value={typeSort as "deadline" | "created" | "normal"}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder={"Sort By"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={"normal"} value={"normal"}>
                    {"Normal"}
                  </SelectItem>
                  <SelectItem key={"deadline"} value={"deadline"}>
                    {"Nearest deadline"}
                  </SelectItem>
                  <SelectItem key={"created"} value={"created"}>
                    {"Newly created"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder={"Filter by title..."}
              className="max-w-sm bg-white"
              value={filters.title}
              onChange={(e) => handleFilterList("title", e.target.value)}
            />

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4 w-full">
                <Select
                  onValueChange={(value) => handleFilterList("status", value)}
                  defaultValue={filters.status}
                  value={filters.status || ""}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder={"Choose Status"} />
                  </SelectTrigger>
                  <SelectContent>
                    {TaskStatus.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4 w-full">
                <Select
                  onValueChange={(value) => handleFilterList("priority", value)}
                  defaultValue={filters.priority}
                  value={filters.priority || ""}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder={"Choose Priority"} />
                  </SelectTrigger>
                  <SelectContent>
                    {TaskPriority.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="outline"
              size="default"
              className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
              type="reset"
              onClick={() => {
                setFilters({
                  title: "",
                  status: undefined,
                  priority: undefined,
                });
                setTypeSort("normal");
              }}
            >
              Clear
            </Button>
          </div>

          <AddCard />
        </section>

        <span className="text-sm text-blue-500 block font-semibold">Found: {visibleList.length} results</span>

        {visibleList.length ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleList.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </section>
        ) : (
          <div className="flex items-center justify-center h-40 w-full">
            <p className="text-muted-foreground">No tasks found matching the current filters.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
