import { google } from "@ai-sdk/google";
import { Providers } from "../../types";
import openRouter from "@/app/config/open-router.config";
import { groq } from "@ai-sdk/groq";
import { gateway } from "ai";
import { openai } from "@ai-sdk/openai";
import { ollama } from "ollama-ai-provider-v2";

export const modelProviderToggleChat = (
  provider: Providers,
  model?: string,
) => {
  switch (provider) {
    case "google":
      // return google(model ?? "gemini-2.5-flash-lite");
      return google(model ?? "gemini-3-flash-preview");
    case "groq":
      // return groq(model ?? "llama-3.1-8b-instant");
      return groq(model ?? "qwen/qwen3-32b");
    case "gateway":
      // return gateway(model ?? "openai/gpt-4.1-nano");
      return gateway(model ?? "openai/gpt-5-mini");
    case "openai":
      return openai(model ?? "gpt-5-mini");
    case "ollama":
      // return ollama(model ?? "qwen2.5:1.5b");
      return ollama(model ?? "deepseek-r1:14b");
    case "openrouter":
    default:
      // return openRouter.chat(model ?? "openai/gpt-4.1-nano");
      return openRouter.chat(model ?? "qwen/qwen3-vl-30b-a3b-thinking");
  }
};
