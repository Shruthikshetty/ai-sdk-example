/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Ref } from "react";
import Image from "next/image";
import { ChatMessage } from "@/app/api/tools/route";

export default function ChatMassageList({
  messages,
  messagesEndRef,
}: {
  messages: ChatMessage[];
  messagesEndRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div className="flex flex-col gap-4 w-full grow pb-4 ">
      {messages.map((messages) => (
        <div
          key={messages.id}
          className={`${messages.role === "user" ? "text-right" : "text-left"}`}
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
                case "tool-getWeather":
                  switch (part.state) {
                    case "input-streaming":
                      return (
                        <div
                          key={`${messages.id}-getWeather-${index}`}
                          className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                        >
                          <p className="text-sm text-zinc-500">
                            Receiving weather request...
                          </p>
                          <pre className="text-xs text-zinc-600 mt-1">
                            {JSON.stringify(part.input, null, 2)}
                          </pre>
                        </div>
                      );

                    case "input-available":
                      return (
                        <div
                          key={`${messages.id}-getWeather-${index}`}
                          className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                        >
                          <p className="text-sm text-zinc-500">
                            Getting Weather for {part.input?.city}...
                          </p>
                        </div>
                      );

                    case "output-available":
                      return (
                        <div
                          key={`${messages.id}-getWeather-${index}`}
                          className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                        >
                          <p className="text-sm text-zinc-500">
                            Weather for <b>{part.input?.city}</b>
                          </p>
                          <div>
                            {/* @ts-expect-error */}
                            {part.output?.location && part.output?.current && (
                              <>
                                {/* @ts-expect-error */}
                                <p>{part.output?.location?.name}</p>
                                {/* @ts-expect-error */}
                                <p>{part.output?.location?.country}</p>
                                {/* @ts-expect-error */}
                                <p>{part.output?.location?.localtime}</p>
                                {/* @ts-expect-error */}
                                <p>{part.output?.current?.condition?.text}</p>
                              </>
                            )}
                          </div>
                        </div>
                      );

                    case "output-error":
                      return (
                        <div
                          key={`${messages.id}-getWeather-${index}`}
                          className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                        >
                          <p className="text-sm text-red-500">
                            Error : {part.errorText}
                          </p>
                        </div>
                      );
                    default:
                      return null;
                  }
                case "file":
                  if (part.mediaType?.startsWith("image/")) {
                    return (
                      <Image
                        key={`${messages.id}-${index}`}
                        src={part.url}
                        alt={part.filename ?? `attachment-${index}`}
                        width={500}
                        height={500}
                      />
                    );
                  }
                  if (part.mediaType?.startsWith("application/pdf")) {
                    return (
                      <iframe
                        key={`${messages.id}-${index}`}
                        src={part.url}
                        title={part.filename ?? `attachment-${index}`}
                        width={500}
                        height={600}
                      />
                    );
                  }
                  return null;

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
