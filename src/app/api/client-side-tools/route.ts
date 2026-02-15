import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  tool,
  stepCountIs,
  generateImage,
  gateway,
  InferUITools,
  UIDataTypes,
} from "ai";
import { z } from "zod";
import { logTokenUsage } from "@/utils/log-token-usage";
import { uploadImage } from "@/app/config/image-kit.config";

//define all the tools
const tools = {
  generateImage: tool({
    description: "Generate an image from a prompt",
    inputSchema: z.object({
      prompt: z.string().describe("The prompt to generate an image from"),
    }),
    execute: async ({ prompt }) => {
      const { image } = await generateImage({
        model: gateway.image("google/imagen-4.0-fast-generate-001"),
        prompt,
      });

      const imageUrl = await uploadImage(image.base64);

      // Return the public URL
      return {
        url: imageUrl,
        description: "Image saved successfully",
      };
    },
  }),
  changeBackground: tool({
    description:
      "replace image background with AI_generated scenes based on text prompt",
    inputSchema: z.object({
      imageUrl: z.string().describe("url of the uploaded image"),
      prompt: z
        .string()
        .describe(
          `description of the new background (e.g., "Modern office", "Nature landscape", "tropical beach sunset" )`,
        ),
    }),
    outputSchema: z.string().describe("The Transformed image url"),
  }),
  removeBackground: tool({
    description: "remove background from an image",
    inputSchema: z.object({
      imageUrl: z.string().describe("url of the uploaded image"),
    }),
    outputSchema: z.string().describe("The Transformed image url"),
  }),
} as const;

export type ImageKitChatTool = InferUITools<typeof tools>;
export type ChatImageKitToolMessages = UIMessage<
  never,
  UIDataTypes,
  ImageKitChatTool
>;

export async function POST(request: Request) {
  const { messages = [] }: { messages: ChatImageKitToolMessages[] } =
    await request.json();

  // in case length of messages is 0 return error
  if (messages.length === 0) {
    return Response.json({ error: "Messages is required" }, { status: 400 });
  }
  try {
    const result = streamText({
      model: openai.chat("gpt-5-mini"), // make sure to use a multi-modal
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });

    // log the token usage
    logTokenUsage(result);

    // convert to ui message stream response
    return result.toUIMessageStreamResponse();
  } catch (error) {
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
