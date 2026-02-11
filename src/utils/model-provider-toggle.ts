import { google } from "@ai-sdk/google";
import { Providers } from "../../types";
import openRouter from "@/app/config/open-router.config";

export const modelProviderToggleChat = (
  provider: Providers,
  model?: string,
) => {
  switch (provider) {
    case "google":
      return google(model ?? "gemini-2.5-flash-lite");
    case "openrouter":
    default:
      return openRouter.chat(model ?? "openai/gpt-4.1-nano");
  }
};
