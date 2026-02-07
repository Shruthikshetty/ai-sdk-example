import { generateText } from "ai";
import openRouter from "../../config/open-router.config";

// post route handler for sending messages to OpenRouter
export async function POST(req: Request) {
  const { prompt } = await req.json();

  // in case prompt is not provided
  if (!prompt) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }

  // generate text from required model
  try {
    const { text } = await generateText({
      model: openRouter.chat("liquid/lfm-2.5-1.2b-instruct:free"),
      prompt: prompt,
    });

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
