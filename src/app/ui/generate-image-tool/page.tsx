"use client";
import ChatMassageList from "@/components/chat-massage-list";
import ErrorMessage from "@/components/error-message";
import Header from "@/components/header";
import PageLayout from "@/components/page-layout";
import Spinner from "@/components/spinner";
import { FileForm } from "@/components/submit-form";
import { useChat } from "@ai-sdk/react";
import { useRef, useEffect } from "react";
import { DefaultChatTransport } from "ai";
import { ChatImageToolMessages } from "@/app/api/generate-image-tool/route";

export default function GenerateImageToolPage() {
  // handle chat using hook
  const { messages, sendMessage, status, error, stop } =
    useChat<ChatImageToolMessages>({
      transport: new DefaultChatTransport({
        api: "/api/generate-image-tool",
      }),
      messages: [],
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
        <Header>Generate Image Tool Page</Header>
        {/* chat messages */}
        <ChatMassageList messages={messages} messagesEndRef={messagesEndRef} />
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
