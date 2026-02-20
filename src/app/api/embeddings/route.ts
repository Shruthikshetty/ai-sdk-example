import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  // get text from req
  const { text } = await req.json();

  if (!text) {
    return Response.json({ error: "text is required" }, { status: 400 });
  }

  try {
    // if text is array use embedMany else use embed
    if (Array.isArray(text)) {
      const { embeddings, usage, values } = await embedMany({
        // batch processing
        model: openai.embedding("text-embedding-3-small"),
        values: text,
        // maxParallelCalls: 5 // allows 5 calls at the same time
      });

      return Response.json({
        embeddings,
        values,
        usage,
        count: embeddings.length,
        dimension: embeddings[0].length,
      });
    }

    // use embedding model
    const { embedding, usage, value } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: text,
    });

    return Response.json({
      embedding,
      value,
      usage,
      dimension: embedding.length,
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
