import openRouter from "@/app/config/open-router.config";
import { generateImage, generateText } from "ai";

export async function POST(request: Request) {
  const { prompt } = await request.json();
  if (!prompt) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }
  try {
    // const { image } = await generateImage({
    //   model: openRouter.imageModel("black-forest-labs/flux-schnell"),
    //   prompt,
    //   size: "1024x1024",
    //   providerOptions: {
    //     openRouter: {
    //       //   style: "vivid",
    //       //   quality: "hd",
    //       modalities: ["image", "text"],
    //       stream: false,
    //     },
    //   },
    // });

    // open router works differently here
    const result = await generateText({
      model: openRouter.chat("black-forest-labs/flux.2-klein-4b"),
      prompt: prompt,
      providerOptions: {
        openrouter: {
          modalities: ["image"],
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageUrl = (result.response.messages[0].content[0] as any)?.data;

    // return the image as base 64
    return Response.json({
      image: imageUrl,
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
