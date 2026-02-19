import { streamText, convertToModelMessages } from "ai";
import { Providers } from "../../../../types";
import { modelProviderToggleChat } from "@/utils/model-provider-toggle";
import type { MyUIMessage } from "@/schemas/message-metadata.schema";

export async function POST(req: Request) {
  // destructure messages from request body
  const {
    messages = [],
    provider = "openrouter",
  }: {
    messages: MyUIMessage[];
    provider?: Providers;
  } = await req.json();

  if (messages.length === 0) {
    return Response.json(
      {
        error: "at least one message is required",
      },
      {
        status: 400,
      },
    );
  }

  try {
    // stream the response from ai model
    const result = streamText({
      model: modelProviderToggleChat(provider),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      messageMetadata({ part }) {
        if (part.type === "start") {
          return {
            createdAt: Date.now(),
          };
        }
        if (part.type === "finish") {
          console.log(part?.totalUsage);
          return {
            totalTokens: part?.totalUsage?.totalTokens,
          };
        }
      },
    });
  } catch (error) {
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
