import * as z from "zod";


const languages = z.enum(["JAVA", "PYTHON", "JAVASCRIPT"])
const difficulties = z.enum(["EASY", "MEDIUM", "HARD"])
const testcase = z.object({
  input: z.string(),
  output: z.string()
})
const example = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string()
})

const problemSchema = z.object({
  title: z.string(),
  description: z.string(),
  constraints: z.string(),
  difficulty: difficulties,
  tags: z.array(z.string()),
  testcases: z.array(testcase),
  editorial: z.string().optional(),
  hints: z.string().optional(),
  examples: z.record(languages, example),
  codeSnippets: z.record(languages, z.string()),
  referenceSolutions: z.record(languages, z.string()), 
})


export default problemSchema;