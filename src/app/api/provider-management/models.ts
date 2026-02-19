import {
  openai as originalOpenai,
  OpenAIChatLanguageModelOptions,
} from "@ai-sdk/openai";
import {
  customProvider,
  defaultSettingsMiddleware,
  wrapLanguageModel,
  createProviderRegistry,
} from "ai";

import { OpenRouterProviderOptions } from "@openrouter/ai-sdk-provider";

import openRouter from "@/app/config/open-router.config";

export const customOpenai = customProvider({
  languageModels: {
    fast: originalOpenai.chat("gpt-5-nano"),
    smart: originalOpenai.chat("gpt-5-mini"),
    turbo: originalOpenai.chat("gpt-5"),
    reasoning: wrapLanguageModel({
      providerId: "openai",
      model: originalOpenai.chat("gpt-5-nano"),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: "high",
              reasoningSummary: "auto",
            } as OpenAIChatLanguageModelOptions,
          },
        },
      }),
    }),
  },
  fallbackProvider: originalOpenai,
});

export const customOPenRouter = customProvider({
  languageModels: {
    fast: openRouter.chat("qwen/qwen3-8b"),
    smart: openRouter.chat("qwen/qwen3-vl-30b-a3b-thinking"),
    turbo: openRouter.chat("qwen/qwen-2.5-72b-instruct"),
    reasoning: wrapLanguageModel({
      providerId: "openrouter",
      model: openRouter.chat("qwen/qwen3-vl-30b-a3b-thinking"),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openrouter: {
              reasoning: {
                effort: "high",
                summary: "auto",
              },
            } as OpenRouterProviderOptions,
          },
        },
      }),
    }),
  },
});

export const customProviderRegistry = createProviderRegistry({
  openrouter: customOPenRouter,
  openai: customOpenai,
});
