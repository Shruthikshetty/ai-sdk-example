import openRouter from "@/app/config/open-router.config";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(req: Request) {
  // destructure messages from request body
  const {
    messages,
  }: {
    messages: UIMessage[];
  } = await req.json();

  // in case there is no messages
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
      model: openRouter.chat("openai/gpt-4.1-nano"),
      messages: [
        {
          role: "system",
          content:
            "you are a coding bot you are supposed to provide the code with proper comments explaining the logic keep the response short with only what is required as code keeping the explanation short ",
        },
        // few shot learning
        {
          role: "user",
          content: "how to toggle a boolean in react",
        },
        {
          role: "assistant",
          content: `
          here is how you can toggle a boolean in react

          // this where we store our value
          const [value , setValue] = useState<boolean>(false);

          // this is how we toggle the value
          const toggleValue = () => {
            setValue((prevValue) => !prevValue);
          };

          // in case you want it to have a button to toggle the value
          return (
            <button onClick={toggleValue}>Toggle</button>
          )
          `,
        },
        ...(await convertToModelMessages(messages)),
      ],
    });

    // return the response as a stream
    return result.toUIMessageStreamResponse();
  } catch (error) {
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
