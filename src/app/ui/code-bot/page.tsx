"use client";
import ChatMassageList from "@/components/chat-massage-list";
import ErrorMessage from "@/components/error-message";
import Header from "@/components/header";
import PageLayout from "@/components/page-layout";
import Spinner from "@/components/spinner";
import SubmitForm from "@/components/submit-form";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { DefaultChatTransport } from "ai";

export default function CodeBotPage() {
  // ref used to scroll to end of messages
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // hold uer input
  const [prompt, setPrompt] = useState<string>("");
  // hook to handle chat
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/code-bot",
    }),
    messages: [],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // form submit handler
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    sendMessage({
      text: prompt,
    });
    // clear input
    setPrompt("");
  };
  return (
    <PageLayout>
      <div className="w-full flex-1 flex flex-col overflow-y-auto min-h-0 thin-scroll pr-2">
        <Header>Code Bot Page</Header>
        {/* chat messages  */}
        <ChatMassageList messages={messages} messagesEndRef={messagesEndRef} />
      </div>
      {/* Loading */}
      {status === "submitted" || status === "streaming" ? <Spinner /> : null}
      {/* Error */}
      {error ? <ErrorMessage error={error.message} /> : null}
      <SubmitForm
        prompt={prompt}
        setPrompt={(e) => setPrompt(e.target.value)}
        isLoading={status != "ready"}
        handleSubmit={handleSubmit}
        stop={stop}
      />
    </PageLayout>
  );
}
