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
import axios from "axios";
import env from "../../../../env";

// all tools go here tools
const tools = {
  getWeather: tool({
    description: "get the weather for a location",
    inputSchema: z.object({
      city: z.string().describe("the city name to get the weather for"),
    }),
    // this is dummy for testing
    execute: async ({ city }) => {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${env.WEATHER_API_KEY}&q=${city}&aqi=no`,
      );
      const weatherDataObject = {
        location: {
          name: response.data?.location?.name,
          country: response.data?.location?.country,
          localtime: response.data?.location?.localtime,
        },
        current: {
          temp_c: response.data?.current?.temp_c,
          temp_f: response.data?.current?.temp_f,
          condition: {
            text: response.data?.current?.condition?.text,
            icon: response.data?.current?.condition?.icon,
            code: response.data?.current?.condition?.code,
          },
        },
      };
      return weatherDataObject;
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
      stopWhen: stepCountIs(2), // allows 2 steps step 1 for calling tool step 2 for generating response
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
