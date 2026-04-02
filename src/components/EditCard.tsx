/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UpdateTaskBody, type UpdateTaskBodyType } from "@/schemaValidation/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskPriority, TaskStatus, type Task } from "@/helpers/type";
import { useAppStore } from "@/helpers/zustand";
import { saveListDataToLocalStorage } from "@/helpers/utils";
import { toast } from "sonner";

export default function EditCard({
  task,
  open,
  onOpenChange,
}: {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dataTasks = useAppStore((state) => state.dataTasks);
  const setDataTasks = useAppStore((state) => state.setDataTasks);

  const form = useForm<UpdateTaskBodyType>({
    resolver: zodResolver(UpdateTaskBody),
    defaultValues: {
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      status: task.status,
      priority: task.priority,
    },
  });

  const reset = () => {
    form.reset();
  };

  const submit = async (values: UpdateTaskBodyType) => {
    const isDeadlineChanged = values.deadline && values.deadline !== task.deadline;

    if (isDeadlineChanged) {
      const newDeadline = new Date(values.deadline as string);
      const now = new Date();
      if (newDeadline.getTime() <= now.getTime()) {
        form.setError("deadline", {
          type: "manual",
          message: "Deadline must be a date in the future",
        });
        return;
      }
    }

    const body = {
      ...values,
      createdAt: task.createdAt,
      deadline: (isDeadlineChanged ? values.deadline : task.deadline) as string,
      id: task.id,
    };
    const listNew = dataTasks.map((t) => (t.id === task.id ? body : t));
    setDataTasks(listNew);
    onOpenChange(false);
    toast.success("Task updated successfully");
    saveListDataToLocalStorage("tasks", listNew);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-150 max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-dish-category-form"
            onReset={reset}
            onSubmit={form.handleSubmit(submit, (err) => {
              console.log(err);
            })}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                <Label htmlFor="title">Id</Label>
                <div className="col-span-3 w-full space-y-2">
                  <Input id="title" className="w-full" value={task.id} disabled />
                </div>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="title">Title</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="title" className="w-full" {...field} />
                        <FormMessage>
                          {Boolean(errors.title?.message) && (errors.title?.message as any)}
                        </FormMessage>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Description</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Textarea id="description" className="w-full" {...field} />
                        <FormMessage>
                          {Boolean(errors.description?.message) && (errors.description?.message as any)}
                        </FormMessage>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="deadline">Deadline</Label>
                      <div className="col-span-3 w-full">
                        <Input
                          type="datetime-local"
                          className="w-full"
                          {...field}
                          onChange={(e) => field.onChange(String(e.target.value))}
                        />

                        <FormMessage>
                          {Boolean(errors.deadline?.message) && (errors.deadline?.message as any)}
                        </FormMessage>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="status">Status</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={"chooseStatus"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TaskStatus.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>
                          {Boolean(errors.status?.message) && (errors.status?.message as any)}
                        </FormMessage>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="priority">Priority</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={"choosePriority"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TaskPriority.map((priority) => (
                              <SelectItem key={priority} value={priority}>
                                {priority}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>
                          {Boolean(errors.priority?.message) && (errors.priority?.message as any)}
                        </FormMessage>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                <Label htmlFor="deadline">Created at</Label>
                <div className="col-span-3 w-full">
                  <Input
                    type="datetime-local"
                    className="w-full"
                    value={new Date(task.createdAt).toISOString().slice(0, 16)}
                    disabled
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="reset" form="add-dish-category-form">
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-dish-category-form"
            className="bg-blue-500 hover:bg-blue-400 text-white"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
