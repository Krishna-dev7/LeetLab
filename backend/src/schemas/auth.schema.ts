// auth controller validation schemas
import * as z from "zod";

const signupSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  images: z.string().optional()
})


const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})


export {
  signupSchema,
  loginSchema
}