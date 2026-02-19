/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Ref } from "react";
import Image from "next/image";
import { ChatMessage } from "@/app/api/multiple-tool/route";
import WeatherCard, { WeatherDataType } from "@/app/ui/api-tools/weather-card";
import { ChatSearchMessage } from "@/app/api/web-search-tool/route";
import { Paperclip } from "lucide-react";
import { ChatImageToolMessages } from "@/app/api/generate-image-tool/route";
import { Image as ImageKitImage } from "@imagekit/next";
import env from "../../env";
import { ChatImageKitToolMessages } from "@/app/api/client-side-tools/route";
import { ChatMCPMessage } from "@/app/api/mcp-tools/route";
import { MyUIMessage } from "@/schemas/message-metadata.schema";
export default function ChatMassageList({
  messages,
  messagesEndRef,
  useImageKit = false,
}: {
  messages:
    | ChatMessage[]
    | ChatSearchMessage[]
    | ChatImageToolMessages[]
    | ChatImageKitToolMessages[]
    | ChatMCPMessage[]
    | MyUIMessage[];

  messagesEndRef?: Ref<HTMLDivElement>;
  useImageKit?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 w-full grow pb-4 ">
      {messages.map((message) => {
        const sources = message.parts?.filter(
          (part) => part.type === "source-url",
        ) as {
          url: string;
          sourceId: string;
          title: string;
        }[];
        return (
          <div
            key={message.id}
            className={`${message.role === "user" ? "text-right" : "text-left"}`}
          >
            <p className="font-bold mb-2">
              {message.role === "user" ? "You" : "AI"}
            </p>
            <div className="flex flex-col gap-2">
              {message.parts.map((part, index) => {
                switch (part.type) {
                  case "reasoning":
                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="text-sm text-blue-500"
                      >
                        <p>Reasoning: {part.text}</p>
                      </div>
                    );
                  case "text":
                    return (
                      <p
                        className="whitespace-pre-wrap"
                        key={`${message.id}-${index}`}
                      >
                        {part.text}
                      </p>
                    );
                  case "tool-getWeather":
                    switch (part.state) {
                      case "input-streaming":
                        return (
                          <div
                            key={`${message.id}-getWeather-${index}`}
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
                            key={`${message.id}-getWeather-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              Getting Weather for {part.input?.city}...
                            </p>
                          </div>
                        );

                      case "output-available":
                        // @ts-ignore
                        if (part.output?.location && part.output?.current) {
                          return (
                            <WeatherCard
                              key={`${message.id}-getWeather-${index}`}
                              weatherData={part.output as WeatherDataType}
                            />
                          );
                        } else {
                          return (
                            <div
                              key={`${message.id}-getWeather-${index}`}
                              className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                            >
                              <p className="text-sm text-zinc-500">
                                Weather for{" "}
                                <b>
                                  {part.input?.city}: {part.output}
                                </b>
                              </p>
                            </div>
                          );
                        }
                      case "output-error":
                        return (
                          <div
                            key={`${message.id}-getWeather-${index}`}
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
                  case "dynamic-tool":
                    switch (part.state) {
                      case "input-streaming":
                        return (
                          <div
                            key={`${message.id}-dynamic-tool-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              Dynamic tool request...
                            </p>
                            <pre className="text-xs text-zinc-600 mt-1">
                              {JSON.stringify(part.input, null, 2)}
                            </pre>
                          </div>
                        );
                      case "input-available":
                        return (
                          <div
                            key={`${message.id}-dynamic-tool-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              Fetching stock price
                            </p>
                            <pre className="text-xs text-zinc-600 mt-1">
                              {JSON.stringify(part.input, null, 2)}
                            </pre>
                          </div>
                        );
                      case "output-available":
                        return (
                          <div
                            key={`${message.id}-dynamic-tool-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              Stock price for retrieved
                            </p>
                            <pre className="text-xs text-zinc-600 mt-1">
                              {JSON.stringify(part.input, null, 2)}
                            </pre>
                          </div>
                        );
                      case "output-error":
                        return (
                          <div
                            key={`${message.id}-dynamic-tool-${index}`}
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

                  case "tool-getLocation":
                    switch (part.state) {
                      case "input-streaming":
                        return (
                          <div
                            key={`${message.id}-getLocation-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              Receiving location request...
                            </p>
                            <pre className="text-xs text-zinc-600 mt-1">
                              {JSON.stringify(part.input, null, 2)}
                            </pre>
                          </div>
                        );
                      case "input-available":
                        return (
                          <div
                            key={`${message.id}-getLocation-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              Getting location for {part.input?.name}...
                            </p>
                          </div>
                        );
                      case "output-available":
                        return (
                          <div
                            key={`${message.id}-getLocation-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              Location for{" "}
                              <b>
                                {part.input?.name}: {part.output}
                              </b>
                            </p>
                          </div>
                        );

                      case "output-error":
                        return (
                          <div
                            key={`${message.id}-getLocation-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-red-500">
                              Error : {part.errorText}
                            </p>
                          </div>
                        );
                    }
                    return null;

                  case "tool-web_search_preview":
                    switch (part.state) {
                      case "input-streaming":
                        return (
                          <div
                            key={`${message.id}-getLocation-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              ⏳ Preparing to search
                            </p>
                          </div>
                        );
                      case "input-available":
                        return (
                          <div
                            key={`${message.id}-getLocation-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              🔎 Searching the web...
                            </p>
                          </div>
                        );
                      case "output-available":
                        return (
                          <div
                            key={`${message.id}-getLocation-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              ✅ Web search complete
                            </p>
                            {/* sources */}

                            {message.role === "assistant" &&
                              sources.length > 0 && (
                                <div className="flex flex-col gap-2 mt-2 border border-blue-400 rounded-sm p-2 bg-blue-400/10">
                                  <p>Sources : {sources.length}</p>
                                  <ul className="flex flex-col gap-2 ">
                                    {sources?.map((source, index) => (
                                      <li
                                        key={source.sourceId + index}
                                        className="bg-gray-600 rounded-xl p-1 text-xs hover:bg-gray-700 flex-wrap flex flex-row gap-1 items-center"
                                      >
                                        <Paperclip className="w-3 h-3" />
                                        <a
                                          href={source.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {source?.title || source.url}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                          </div>
                        );
                      case "output-error":
                        return (
                          <div
                            key={`${message.id}-getLocation-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-red-500">
                              Error web search failed : {part.errorText}
                            </p>
                          </div>
                        );
                    }

                    return null;
                  case "file":
                    if (part.mediaType?.startsWith("image/")) {
                      return (
                        <Image
                          key={`${message.id}-${index}`}
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
                          key={`${message.id}-${index}`}
                          src={part.url}
                          title={part.filename ?? `attachment-${index}`}
                          width={500}
                          height={600}
                        />
                      );
                    }
                    return null;

                  case "tool-generateImage":
                    switch (part.state) {
                      case "input-streaming":
                        return (
                          <div
                            key={`${message.id}-gen-image-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              ⏳ receiving image generation prompt
                            </p>
                          </div>
                        );
                      case "input-available":
                        return (
                          <div
                            key={`${message.id}-gen-image-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              Generating image for {part.input.prompt}
                            </p>
                          </div>
                        );
                      case "output-available":
                        return (
                          <div
                            key={`${message.id}-gen-image-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <h1 className="text-sm text-zinc-500">
                              Generated image
                            </h1>
                            {useImageKit ? (
                              <ImageKitImage
                                src={part.output.url}
                                urlEndpoint={env.NEXT_PUBLIC_IMAGE_KIT_URL}
                                alt="generated image"
                                width={500}
                                height={500}
                                className="rounded-lg"
                              />
                            ) : (
                              <Image
                                src={`${part.output.url}`}
                                alt="generated image"
                                width={500}
                                height={500}
                                className="rounded-lg"
                              />
                            )}
                          </div>
                        );
                      case "output-error":
                        console.log(part.errorText);
                        return (
                          <div
                            key={`${message.id}-gen-image-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-red-500">
                              Error generating image : {part.errorText}
                            </p>
                          </div>
                        );
                      default:
                        return null;
                    }
                  default:
                    return "";

                  case "tool-changeBackground":
                    switch (part.state) {
                      case "input-available":
                        return (
                          <div
                            key={`${message.id}-trans-changeBackground-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              changing background to : {part.input.prompt}
                            </p>
                          </div>
                        );
                      case "output-available":
                        return (
                          <div
                            key={`${message.id}-trans-changeBackground-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              changed background to : {part.input.prompt}
                            </p>
                            <ImageKitImage
                              src={part.output}
                              urlEndpoint={env.NEXT_PUBLIC_IMAGE_KIT_URL}
                              alt="generated image"
                              width={500}
                              height={500}
                              className="rounded-lg"
                            />
                          </div>
                        );
                      case "output-error":
                        console.log(part.errorText);
                        return (
                          <div
                            key={`${message.id}-trans-changeBackground-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-red-500">
                              Error generating image : {part.errorText}
                            </p>
                          </div>
                        );
                      default:
                        return null;
                    }
                  case "tool-removeBackground":
                    switch (part.state) {
                      case "input-available":
                        return (
                          <div
                            key={`${message.id}-trans-removeBackground-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              removing background
                            </p>
                          </div>
                        );
                      case "output-available":
                        return (
                          <div
                            key={`${message.id}-trans-removeBackground-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-zinc-500">
                              Removed background image from {part.output}
                            </p>
                            <ImageKitImage
                              src={part.output}
                              urlEndpoint={env.NEXT_PUBLIC_IMAGE_KIT_URL}
                              alt="generated image"
                              width={500}
                              height={500}
                              className="rounded-lg"
                            />
                          </div>
                        );
                      case "output-error":
                        console.log(part.errorText);
                        return (
                          <div
                            key={`${message.id}-trans-removeBackground-${index}`}
                            className=" p-2 rounded-sm border-zinc-200 bg-zinc-800/50"
                          >
                            <p className="text-sm text-red-500">
                              Error generating image : {part.errorText}
                            </p>
                          </div>
                        );
                      default:
                        return null;
                    }
                }
              })}

              <div className="flex flex-row  gap-3">
                <p>
                  {message.metadata?.totalTokens && (
                    <p className="text-sm text-zinc-500">
                      Total Tokens: {message.metadata.totalTokens}
                    </p>
                  )}
                </p>
                <p>
                  {message.metadata?.createdAt && (
                    <p className="text-sm text-zinc-500">
                      Created at:{" "}
                      {new Date(message.metadata.createdAt).toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
