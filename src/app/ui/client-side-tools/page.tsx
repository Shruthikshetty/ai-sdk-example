"use client";
import ChatMassageList from "@/components/chat-massage-list";
import ErrorMessage from "@/components/error-message";
import Header from "@/components/header";
import PageLayout from "@/components/page-layout";
import Spinner from "@/components/spinner";
import { FileForm } from "@/components/submit-form";
import { useChat } from "@ai-sdk/react";
import { useRef, useEffect } from "react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { ChatImageKitToolMessages } from "@/app/api/client-side-tools/route";

// function build transformation url
function buildTransformationUrl(
  baseUrl: string,
  transformation: string,
): string {
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}tr=${transformation}`;
}

export default function ClientSidePage() {
  // handle chat using hook
  const { messages, sendMessage, status, error, stop, addToolResult } =
    useChat<ChatImageKitToolMessages>({
      transport: new DefaultChatTransport({
        api: "/api/client-side-tools",
      }),
      messages: [],
      // automatically send reply when the last tool call is complete
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
      async onToolCall({ toolCall }) {
        // dynamic are which we don't know the input and output types are not known while compile time
        if (toolCall.dynamic) return;
        switch (toolCall.toolName) {
          case "changeBackground":
            {
              const { imageUrl, prompt } = toolCall.input;
              const transformation = `e-changebg-prompt-${prompt}`;
              const transformationUrl = buildTransformationUrl(
                imageUrl,
                transformation,
              );
              addToolResult({
                tool: "changeBackground",
                toolCallId: toolCall.toolCallId,
                output: transformationUrl,
              });
            }
            break;
          case "removeBackground":
            {
              const { imageUrl } = toolCall.input;
              const transformation = "e-bgremove";
              const transformationUrl = buildTransformationUrl(
                imageUrl,
                transformation,
              );
              addToolResult({
                tool: "removeBackground",
                toolCallId: toolCall.toolCallId,
                output: transformationUrl,
              });
            }
            break;
        }
      },
    });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // handle form submit
  const handleFormSubmit = ({
    prompt,
    files,
  }: {
    prompt: string;
    files?: FileList;
  }) => {
    // in case no input is provided return
    if (!prompt) return;
    // send message
    sendMessage({
      text: prompt,
      files: files,
    });
  };
  return (
    <PageLayout>
      <div className="w-full flex-1 flex flex-col overflow-y-auto min-h-0 thin-scroll pr-2">
        <Header>Client side tools (image transform)</Header>
        {/* chat messages */}
        <ChatMassageList
          messages={messages}
          messagesEndRef={messagesEndRef}
          useImageKit
        />
      </div>
      {/* Loading */}
      {status === "submitted" || status === "streaming" ? <Spinner /> : null}
      {/* Error */}
      {error ? <ErrorMessage error={error.message} /> : null}
      <FileForm
        isLoading={status != "ready"}
        handleSubmit={handleFormSubmit}
        stop={stop}
      />
    </PageLayout>
  );
}
