import { UIMessage, streamText, convertToModelMessages } from "ai";
import openRouter from "@/app/config/open-router.config";

export async function POST(req: Request) {
  // destructure messages from request body
  const {
    messages = [],
  }: {
    messages: UIMessage[];
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
      model: openRouter.chat("openai/gpt-4.1-nano"),
      messages: await convertToModelMessages(messages),
    });
    // log the token usage
    result.usage.then((usage) => {
      console.log("token usage ----->", {
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
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
