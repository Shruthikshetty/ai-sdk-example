import { UIMessage, streamText, convertToModelMessages } from "ai";
import { Providers } from "../../../../types";
import { customProviderRegistry } from "./models";

export async function POST(req: Request) {
  // destructure messages from request body
  const {
    messages = [],
  }: {
    messages: UIMessage[];
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
      model: customProviderRegistry.languageModel("openai:fast"),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
    });
  } catch (error) {
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
