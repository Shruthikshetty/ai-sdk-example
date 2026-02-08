"use client";
import ErrorMessage from "@/components/error-message";
import Header from "@/components/header";
import PageLayout from "@/components/page-layout";
import Spinner from "@/components/spinner";
import SubmitForm from "@/components/submit-form";
import { UIMessage, useChat } from "@ai-sdk/react";

import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  // the chat message
  const [input, setInput] = useState("");
  // handle chat using hook
  const { messages, sendMessage, status, error, stop } = useChat({
    // default api is /api/chat
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
    sendMessage({
      text: input,
    });
    // resent input message
    setInput("");
  };
  return (
    <PageLayout>
      <div className="w-full flex-1 flex flex-col overflow-y-auto min-h-0 thin-scroll pr-2">
        <Header>Chat Page</Header>
        {/* chat messages */}
        <div className="flex flex-col gap-4 w-full grow pb-4 ">
          {messages.map((messages: UIMessage) => (
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
                    default:
                      return "";
                  }
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
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
