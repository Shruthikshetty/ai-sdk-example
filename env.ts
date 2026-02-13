// this file allows to access the envs in a type safe way
import { z } from "zod";

// create a env schema
const EnvSchema = z.object({
  OPEN_ROUTER_KEY: z.string().optional().default(""),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional().default(""),
  GROQ_API_KEY: z.string().optional().default(""),
  AI_GATEWAY_API_KEY: z.string().optional().default(""),
  WEATHER_API_KEY: z.string(),
});

// infer the env type
type ENV = z.infer<typeof EnvSchema>;

let tempEnv: ENV;

try {
  tempEnv = EnvSchema.parse(process.env);
} catch (err) {
  const error = err as z.ZodError;
  console.error("Invalid environment variables: ", z.flattenError(error));
  // throw error
  throw new Error("Invalid environment variables");
}

const env = tempEnv;
//export type save env
export default env;
