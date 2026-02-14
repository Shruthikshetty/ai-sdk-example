"use client";
import ChatMassageList from "@/components/chat-massage-list";
import ErrorMessage from "@/components/error-message";
import Header from "@/components/header";
import PageLayout from "@/components/page-layout";
import Spinner from "@/components/spinner";
import SubmitForm from "@/components/submit-form";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { ChatSearchMessage } from "@/app/api/web-search-tool/route";

export default function WebSearchToolPage() {
  // the chat message
  const [input, setInput] = useState("");
  // handle chat using hook
  const { messages, sendMessage, status, error, stop } =
    useChat<ChatSearchMessage>({
      transport: new DefaultChatTransport({
        api: "/api/web-search-tool",
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
  const handleFormSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    // resent input message
    setInput("");
  };
  return (
    <PageLayout>
      <div className="w-full flex-1 flex flex-col overflow-y-auto min-h-0 thin-scroll pr-2">
        <Header>chat with web search </Header>
        {/* chat messages */}
        <ChatMassageList messages={messages} messagesEndRef={messagesEndRef} />
      </div>
      {/* Loading */}
      {status === "submitted" || status === "streaming" ? <Spinner /> : null}
      {/* Error */}
      {error ? <ErrorMessage error={error.message} /> : null}
      <SubmitForm
        prompt={input}
        setPrompt={(e) => setInput(e.target.value)}
        isLoading={status != "ready"}
        handleSubmit={handleFormSubmit}
        stop={stop}
      />
    </PageLayout>
  );
}
