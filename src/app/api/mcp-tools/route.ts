import {
  UIMessage,
  streamText,
  convertToModelMessages,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { createMCPClient } from "@ai-sdk/mcp";
import { Providers } from "../../../../types";
import { modelProviderToggleChat } from "@/utils/model-provider-toggle";
import { z } from "zod";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
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
      if (city === "Gotham City") {
        return "70F and cloudy";
      } else if (city === "Metropolis") {
        return "80F and sunny";
      } else {
        return "unknown city";
      }
    },
  }),
};

// type safety for massage
export type ChatMCPTools = InferUITools<typeof tools>;
export type ChatMCPMessage = UIMessage<never, UIDataTypes, ChatMCPTools>;

export async function POST(req: Request) {
  // destructure messages from request body
  const {
    messages = [],
    provider = "openrouter",
  }: {
    messages: ChatMCPMessage[];
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

  // connect to mcp
  const httpTransport = new StreamableHTTPClientTransport(
    new URL(`${env.MCP_URL}`),
    {
      requestInit: {
        headers: {
          Authorization: `Bearer ${env.MCP_AUTH_TOKEN}`,
        },
      },
    },
  );

  // create the mcp client
  const mcpClient = createMCPClient({
    transport: httpTransport,
  });

  const mcpTools = await (await mcpClient).tools();

  try {
    // stream the response from ai model
    const result = streamText({
      model: modelProviderToggleChat(provider),
      messages: await convertToModelMessages(messages),
      tools: {
        ...mcpTools,
        ...tools,
      },
      stopWhen: stepCountIs(2), // allows 2 steps step 1 for calling tool step 2 for generating response
      onFinish: async () => {
        await (await mcpClient).close();
      },
      onError: async (error) => {
        await (await mcpClient).close();
        console.log("----> error during streaming ", error);
      },
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
