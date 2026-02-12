import { groq } from "@ai-sdk/groq";
import { experimental_transcribe as transcribe } from "ai";

export async function POST(request: Request) {
  const formData = await request.formData();
  const audioFile = formData.get("audio") as File;
  // in case of no audio file return error
  if (!audioFile) {
    return Response.json({ error: "Audio file is required" }, { status: 400 });
  }

  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // transcribe audio
    const transcript = await transcribe({
      model: groq.transcription("whisper-large-v3"),
      audio: uint8Array,
    });

    // return transcript
    return Response.json({ transcript });
  } catch (error) {
    console.log(error);
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
