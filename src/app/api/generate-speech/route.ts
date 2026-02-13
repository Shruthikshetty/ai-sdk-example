import { openai } from "@ai-sdk/openai";
import { experimental_generateSpeech as generateSpeech } from "ai";

export async function POST(request: Request) {
  const { text } = await request.json();
  // in case no text is provided
  if (!text) return new Response("Text is required", { status: 400 });

  try {
    const { audio } = await generateSpeech({
      model: openai.speech("gpt-4o-mini-tts"),
      text,
      voice: "nova",
    });

    return new Response(Buffer.from(audio.uint8Array), {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
