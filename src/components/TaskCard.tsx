import { Button } from "@/components/ui/button";
import type { Task, TaskPriority, TaskStatus } from "../helpers/type";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useAppStore } from "@/helpers/zustand";
import { saveListDataToLocalStorage } from "@/helpers/utils";
import { toast } from "sonner";
import EditCard from "@/components/EditCard";

type TaskCardProps = {
  task: Task;
};

const statusStyles: Record<TaskStatus, string> = {
  "To Do": "bg-red-500 text-white ring-1 ring-red-200",
  "In Progress": "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  Done: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
};

const priorityStyles: Record<TaskPriority, string> = {
  Low: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  Medium: "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200",
  High: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
  Urgent: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const date = new Date();
export function TaskCard({ task }: TaskCardProps) {
  const [showTypeDialog, setShowTypeDialog] = useState<"edit" | "delete" | null>(null);
  const dataTasks = useAppStore((state) => state.dataTasks);
  const setDataTasks = useAppStore((state) => state.setDataTasks);

  const handleDeleteTask = (id: string) => {
    const newList = dataTasks.filter((task) => task.id !== id);
    toast.success("Task deleted successfully");
    setDataTasks(newList);
    saveListDataToLocalStorage("tasks", newList);
    setShowTypeDialog(null);
  };

  const [isOverdue, setIsOverdue] = useState(
    task.status !== "Done" && new Date(task.deadline).getTime() < date.getTime(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setIsOverdue(task.status !== "Done" && new Date(task.deadline).getTime() < now.getTime());
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [task.deadline, task.status]);

  useEffect(() => {
    const now = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOverdue(task.status !== "Done" && new Date(task.deadline).getTime() < now.getTime());
  }, [task.deadline, task.status]);

  return (
    <section
      className={`group rounded-2xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg h-87.5 flex items-stretch flex-col justify-between ${isOverdue ? "border-red-500 bg-red-100" : "border-slate-200 bg-white"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold leading-snug text-red-600">{task.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Status:</span>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[task.status]}`}
          >
            {task.status}
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between border-b border-slate-100 pb-4">
        <span className="text-slate-700 text-sm font-semibold">Priority</span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-sm leading-6 text-slate-600 line-clamp-2">Description: {task.description}</p>

      <div className="mt-5 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Deadline</span>
          <span className="font-medium text-slate-800">{formatDate(task.deadline)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Created At</span>
          <span className="font-medium text-slate-800">{formatDate(task.createdAt)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Id</span>
          <span className="font-medium text-slate-800">{task.id}</span>
        </div>
      </div>

      <div className="flex justify-end items-center gap-2 mt-4">
        <Button variant="destructive" onClick={() => setShowTypeDialog("delete")}>
          Delete
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowTypeDialog("edit")}
          className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
        >
          Edit
        </Button>
      </div>

      {isOverdue && (
        <div>
          <span className="text-sm text-red-500 font-semibold">This task is overdue!</span>
        </div>
      )}

      <Dialog open={showTypeDialog === "delete"} onOpenChange={(open) => !open && setShowTypeDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setShowTypeDialog(null)}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" onClick={() => handleDeleteTask(task.id)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditCard
        task={task}
        open={showTypeDialog === "edit"}
        onOpenChange={(open) => !open && setShowTypeDialog(null)}
      />
    </section>
  );
}
