import { UIMessage, streamText, convertToModelMessages } from "ai";
import { Providers } from "../../../../types";
import { modelProviderToggleChat } from "@/utils/model-provider-toggle";
import { logTokenUsage } from "@/utils/log-token-usage";
import { OpenAILanguageModelResponsesOptions } from "@ai-sdk/openai";
import { OllamaCompletionProviderOptions } from "ollama-ai-provider-v2";
import { OpenRouterProviderOptions } from "@openrouter/ai-sdk-provider";
import { GroqProviderOptions } from "@ai-sdk/groq";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";

export async function POST(req: Request) {
  // destructure messages from request body
  const {
    messages = [],
    provider = "openrouter",
  }: {
    messages: UIMessage[];
    provider?: Providers;
  } = await req.json();

  if (messages.length === 0) {
    return Response.json(
      {
        error: "at least one message is required",
      },
      {
        status: 400,
      },
    );
  }

  try {
    // stream the response from ai model
    const result = streamText({
      model: modelProviderToggleChat(provider),
      messages: await convertToModelMessages(messages),
      providerOptions: {
        openai: {
          reasoningEffort: "low",
          reasoningSummary: "auto",
        } satisfies OpenAILanguageModelResponsesOptions,
        ollama: {
          think: true,
        } satisfies OllamaCompletionProviderOptions,
        openrouter: {
          reasoning: {
            effort: "low",
            enabled: true,
          },
        } satisfies OpenRouterProviderOptions,
        groq: {
          reasoningEffort: "default",
          reasoningFormat: "parsed",
        } satisfies GroqProviderOptions,
        google: {
          thinkingConfig: {
            thinkingLevel: "low",
            includeThoughts: true,
          },
        } as GoogleGenerativeAIProviderOptions,
      },
    });
    // log the token usage
    logTokenUsage(result);

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
    });
  } catch (error) {
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
