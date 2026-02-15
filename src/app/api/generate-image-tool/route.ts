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
import path from "path";
import fs from "fs";
import { z } from "zod";
import { logTokenUsage } from "@/utils/log-token-usage";

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

      // store images locally rather than maintaining base64 in messages
      //  Create a unique filename
      const filename = `generated-${crypto.randomUUID()}.png`;
      const filePath = path.join(process.cwd(), "public", "images", filename);
      // Save the base64 string as a file
      fs.writeFileSync(filePath, image.uint8Array);

      // Return the public URL
      return {
        url: `/images/${filename}`,
        description: "Image saved successfully",
      };
    },
    toModelOutput: (result) => {
      // Tell the model exactly where the image is without sending the data
      return {
        type: "text",
        value: `Image generated and available at: ${result.output.url}`,
      };
    },
  }),
} as const;

export type ImageChatTool = InferUITools<typeof tools>;
export type ChatImageToolMessages = UIMessage<
  never,
  UIDataTypes,
  ImageChatTool
>;

export async function POST(request: Request) {
  const { messages = [] }: { messages: ChatImageToolMessages[] } =
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
