import { generateImage, gateway } from "ai";

export async function POST(request: Request) {
  const { prompt } = await request.json();
  if (!prompt) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }
  try {
    const { image } = await generateImage({
      model: gateway.image("google/imagen-4.0-fast-generate-001"),
      prompt,
    });

    // open router works differently here (dose not follow open ai standers hance we dont use it for image generation)
    // const result = await generateText({
    //   model: openRouter.chat("black-forest-labs/flux.2-klein-4b"),
    //   prompt: prompt,
    //   providerOptions: {
    //     openrouter: {
    //       modalities: ["image"],
    //     },
    //   },
    // });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //const imageUrl = (result.response.messages[0].content[0] as any)?.data;

    // return the image as base 64
    return Response.json({
      image: image.base64,
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
