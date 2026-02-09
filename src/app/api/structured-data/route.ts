import { streamText, Output } from "ai";
import openRouter from "@/app/config/open-router.config";
import { recipeSchema } from "@/schemas/recipe.schema";

export async function POST(request: Request) {
  const { dish } = await request.json();

  // in case not dish is entered
  if (!dish) {
    return Response.json({ error: "Dish is required" }, { status: 400 });
  }

  try {
    const result = streamText({
      model: openRouter("google/gemini-2.5-flash-lite"),
      output: Output.object({ schema: recipeSchema }),
      messages: [
        {
          role: "user",
          content: `Generate a recipe for ${dish}`,
        },
      ],
    });

    // return result
    return result.toTextStreamResponse();
  } catch (error) {
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
