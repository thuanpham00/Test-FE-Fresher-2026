/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateTaskBody, type CreateTaskBodyType } from "@/schemaValidation/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskPriority, TaskStatus } from "@/helpers/type";
import { useAppStore } from "@/helpers/zustand";
import { saveListDataToLocalStorage } from "@/helpers/utils";
import { toast } from "sonner";

export default function AddCard() {
  const dataTasks = useAppStore((state) => state.dataTasks);
  const setDataTasks = useAppStore((state) => state.setDataTasks);

  const [open, setOpen] = useState(false);

  const form = useForm<CreateTaskBodyType>({
    resolver: zodResolver(CreateTaskBody),
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      status: "To Do" as TaskStatus,
      priority: "Medium" as TaskPriority,
    },
  });

  const reset = () => {
    form.reset();
  };

  const submit = async (values: CreateTaskBodyType) => {
    const date = new Date();
    const body = {
      ...values,
      createdAt: new Date().toISOString(),
      id: `task-${date.getTime()}`,
    };
    const listNew = [...dataTasks, body];
    setDataTasks(listNew);
    setOpen(false);
    toast.success("Task added successfully");
    saveListDataToLocalStorage("tasks", listNew);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Card</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150 max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
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
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="reset" form="add-dish-category-form">
            Delete
          </Button>
          <Button
            type="submit"
            form="add-dish-category-form"
            className="bg-blue-500 hover:bg-blue-400 text-white"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
