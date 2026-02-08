import { streamText } from "ai";
import openRouter from "@/app/config/open-router.config";

// stream the response from ai model
export async function POST(req: Request) {
  const { prompt } = await req.json();

  // in case prompt is not provided
  if (!prompt) {
    return Response.json(
      {
        error: "Prompt is required",
      },
      {
        status: 400,
      },
    );
  }

  // call the api model from ai sdk
  try {
    const result = streamText({
      model: openRouter.chat("openai/gpt-4.1-nano"),
      prompt,
    });

    // log the token usage
    result.usage.then((usage) => {
      console.log("token usage ----->", {
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
