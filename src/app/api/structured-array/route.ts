import openRouter from "@/app/config/open-router.config";
import { pokemonSchema } from "@/schemas/pokemon.schema";
import { streamText, Output } from "ai";

export async function POST(request: Request) {
  const { pokemon } = await request.json();

  // in case pokemon is not entered
  if (!pokemon) {
    return Response.json({ error: "Pokemon is required" }, { status: 400 });
  }

  try {
    const result = streamText({
      model: openRouter.chat("openai/gpt-4.1-nano"),
      output: Output.array({ element: pokemonSchema }),
      messages: [
        {
          role: "user",
          content: `generate a list of 5 - 10 pokemon of types:- ${pokemon}`,
        },
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
