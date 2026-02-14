import {
  UIMessage,
  streamText,
  convertToModelMessages,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { Providers } from "../../../../types";
import { modelProviderToggleChat } from "@/utils/model-provider-toggle";
import { z } from "zod";

// all tools go here tools
const tools = {
  getWeather: tool({
    description: "get the weather for a location",
    inputSchema: z.object({
      city: z.string().describe("the city name to get the weather for"),
    }),
    // this is dummy for testing
    execute: async ({ city }) => {
      if (city === "Gotham City") {
        return "70F and cloudy";
      } else if (city === "Metropolis") {
        return "80F and sunny";
      } else {
        return "unknown city";
      }
    },
  }),
  getLocation: tool({
    description: "get location of the user",
    inputSchema: z.object({
      name: z.string().describe("the name of the user"),
    }),
    execute: async ({ name }) => {
      if (name === "Bruce Wayne") {
        return "Gotham City";
      } else if (name === "John Doe") {
        return "Metropolis";
      } else {
        return "unknown location";
      }
    },
  }),
};

// type safety for massage
export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  // destructure messages from request body
  const {
    messages = [],
    provider = "openrouter",
  }: {
    messages: ChatMessage[];
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
      tools,
      stopWhen: stepCountIs(3), // 3 steps required since we have 2 tools available
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
