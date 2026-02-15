// this file allows to access the envs in a type safe way
import { z } from "zod";

// create a env schema
const isServer = typeof window === "undefined";

// create a env schema
const EnvSchema = z.object({
  OPEN_ROUTER_KEY: z.string().optional().default(""),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional().default(""),
  GROQ_API_KEY: z.string().optional().default(""),
  AI_GATEWAY_API_KEY: z.string().optional().default(""),
  WEATHER_API_KEY: isServer
    ? z.string().min(1)
    : z.string().optional().default(""),
  NEXT_PUBLIC_IMAGE_KIT_URL: z.string(),
  NEXT_PUBLIC_IMAGE_PUBLIC_KEY: z.string(),
  IMAGEKIT_PRIVATE_KEY: isServer
    ? z.string().min(1)
    : z.string().optional().default(""),
  MCP_URL: isServer ? z.string().min(1) : z.string().optional().default(""),
  MCP_AUTH_TOKEN: isServer
    ? z.string().min(1)
    : z.string().optional().default(""),
});

// infer the env type
type ENV = z.infer<typeof EnvSchema>;

let tempEnv: ENV;

try {
  tempEnv = EnvSchema.parse({
    OPEN_ROUTER_KEY: process.env.OPEN_ROUTER_KEY?.trim(),
    GOOGLE_GENERATIVE_AI_API_KEY:
      process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim(),
    GROQ_API_KEY: process.env.GROQ_API_KEY?.trim(),
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY?.trim(),
    WEATHER_API_KEY: process.env.WEATHER_API_KEY?.trim(),
    NEXT_PUBLIC_IMAGE_KIT_URL: process.env.NEXT_PUBLIC_IMAGE_KIT_URL?.trim(),
    NEXT_PUBLIC_IMAGE_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_IMAGE_PUBLIC_KEY?.trim(),
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY?.trim(),
    MCP_URL: process.env.MCP_URL?.trim(),
    MCP_AUTH_TOKEN: process.env.MCP_AUTH_TOKEN?.trim(),
  });
} catch (err) {
  const error = err as z.ZodError;
  console.error("Invalid environment variables: ", z.flattenError(error));
  // throw error
  throw new Error("Invalid environment variables");
}

const env = tempEnv;
//export type save env
export default env;
