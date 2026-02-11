import openRouter from "@/app/config/open-router.config";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(request: Request) {
  const { messages = [] }: { messages: UIMessage[] } = await request.json();

  // in case length of messages is 0 return error
  if (messages.length === 0) {
    return Response.json({ error: "Messages is required" }, { status: 400 });
  }
  try {
    const result = streamText({
      model: openRouter.chat("openai/gpt-4.1-nano"), // make sure to use a multi-modal
      messages: await convertToModelMessages(messages),
    });

    // convert to ui message stream response
    return result.toUIMessageStreamResponse();
  } catch (error) {
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
