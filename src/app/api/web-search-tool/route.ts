import {
  UIMessage,
  streamText,
  convertToModelMessages,
  InferUITools,
  UIDataTypes,
  stepCountIs,
  Tool,
} from "ai";
import { openai } from "@ai-sdk/openai";

// all tools go here tools
const tools = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  web_search_preview: openai.tools.webSearch({}) as Tool<any, any>,
};

// type safety for massage
export type ChatSearchTools = InferUITools<typeof tools>;
export type ChatSearchMessage = UIMessage<never, UIDataTypes, ChatSearchTools>;

export async function POST(req: Request) {
  // destructure messages from request body
  const {
    messages = [],
  }: {
    messages: ChatSearchMessage[];
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
      model: openai.responses("gpt-5-mini"),
      messages: await convertToModelMessages(messages),
      tools: tools,
      // way to use search using open router
      // providerOptions: {
      //   openrouter: {
      //     plugins: [
      //       {
      //         id: "web",
      //         max_results: 2,
      //         engine: "exa",
      //       },
      //     ],
      //   },
      // },
      stopWhen: stepCountIs(2),
    });

    return result.toUIMessageStreamResponse({ sendSources: true });
  } catch (error) {
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
