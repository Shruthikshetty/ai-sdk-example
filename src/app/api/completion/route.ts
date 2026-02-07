import { generateText } from "ai";
import openRouter from "../../config/open-router.config";

// post route handler for sending messages to OpenRouter
export async function POST() {
  try {
    const { text } = await generateText({
      model: openRouter.chat("openai/gpt-4.1-nano"),
      prompt: "Explain what an llm is in simple terms",
    });
    console.log("text", text);

    // return the response
    return Response.json({ text });
  } catch (error) {
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
