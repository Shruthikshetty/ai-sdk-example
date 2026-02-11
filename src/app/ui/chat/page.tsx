"use client";
import ChatMassageList from "@/components/chat-massage-list";
import ErrorMessage from "@/components/error-message";
import Header from "@/components/header";
import ModelToggleButtons from "@/components/model-toggle-buttons";
import PageLayout from "@/components/page-layout";
import Spinner from "@/components/spinner";
import SubmitForm from "@/components/submit-form";
import { providerList } from "@/utils/provider-list";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  // the chat message
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("openrouter");
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
    sendMessage(
      { text: input },
      {
        body: {
          provider: selectedModel,
        },
      },
    );
    // resent input message
    setInput("");
  };
  return (
    <PageLayout>
      <div className="w-full flex-1 flex flex-col overflow-y-auto min-h-0 thin-scroll pr-2">
        <Header>Chat Page</Header>
        <ModelToggleButtons
          buttons={providerList}
          selected={selectedModel}
          setSelected={setSelectedModel}
        />
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
