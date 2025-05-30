import z from "zod";
import * as dotEnv from "dotenv";

dotEnv.config();

const envSchema = z.object({
  PORT: z.string(),
  MONGODB_URI: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]),
})

function createEnv(env: NodeJS.ProcessEnv){
  const validationResult = envSchema.safeParse(env);
  
  if(!validationResult.success)
    throw new Error(validationResult.error.message);
  
  return validationResult.data;
}

const env = createEnv(process.env);
export default env;