import { UIMessage } from "ai";
import { Ref } from "react";
import Image from "next/image";

export default function ChatMassageList({
  messages,
  messagesEndRef,
}: {
  messages: UIMessage[];
  messagesEndRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div className="flex flex-col gap-4 w-full grow pb-4 ">
      {messages.map((messages) => (
        <div
          key={messages.id}
          className={`${messages.role === "user" ? "text-right " : "text-left"}`}
        >
          <p className="font-bold mb-2">
            {messages.role === "user" ? "You" : "AI"}
          </p>
          <div>
            {messages.parts.map((part, index) => {
              switch (part.type) {
                case "text":
                  return (
                    <p
                      className="whitespace-pre-wrap"
                      key={`${messages.id}-${index}`}
                    >
                      {part.text}
                    </p>
                  );
                case "file":
                  if (part.mediaType?.startsWith("image/"))
                    console.log(part?.url);
                  return (
                    <Image
                      key={`${messages.id}-${index}`}
                      src={part.url}
                      alt={part.filename ?? `attachment-${index}`}
                      width={500}
                      height={500}
                    />
                  );
                default:
                  return "";
              }
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
