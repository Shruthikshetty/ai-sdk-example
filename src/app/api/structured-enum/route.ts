import openRouter from "@/app/config/open-router.config";
import { generateText, Output } from "ai";

export async function POST(request: Request) {
  const { text } = await request.json();
  // in case not text is entered
  if (!text) {
    return Response.json({ error: "Text is required" }, { status: 400 });
  }
  try {
    const result = await generateText({
      model: openRouter("openai/gpt-4o-mini"),
      output: Output.choice({
        options: ["positive", "negative", "neutral"],
      }),
      prompt: `Classify the following text :- ${text}`,
    });

    return Response.json({ text: result.text });
  } catch (error) {
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
