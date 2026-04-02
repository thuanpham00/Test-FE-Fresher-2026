import z from "zod";

export const CreateTaskBody = z
  .object({
    title: z
      .string()
      .min(5, { message: "Title must be at least 5 characters long." })
      .max(256, { message: "Title must be at most 256 characters long." }),
    description: z.string().max(10000, { message: "Description is too long." }),
    deadline: z.string().min(1, { message: "Deadline is required." }),
    status: z.enum(["To Do", "In Progress", "Done"]),
    priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  })
  .refine(
    (data) => {
      if (!data.deadline) return true;
      const deadline = new Date(data.deadline);
      const now = new Date();
      return deadline.getTime() > now.getTime();
    },
    {
      message: "Deadline must be a date in the future",
      path: ["deadline"],
    },
  );

export type CreateTaskBodyType = z.TypeOf<typeof CreateTaskBody>;

export const UpdateTaskBody = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long." })
    .max(256, { message: "Title must be at most 256 characters long." }),
  description: z.string().max(10000, { message: "Description is too long." }),
  deadline: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
});

export type UpdateTaskBodyType = z.TypeOf<typeof UpdateTaskBody>;

export const SearchTask = z.object({
  title: z.string().max(256).optional(),
  status: z.enum(["To Do", "In Progress", "Done"]).optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
});

export type SearchTaskType = z.TypeOf<typeof SearchTask>;
