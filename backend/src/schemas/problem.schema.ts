import * as z from "zod";

const problemSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.string().optional(),
  constraints: z.string().optional(),

})