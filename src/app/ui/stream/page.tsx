"use client";
import { useCompletion } from "@ai-sdk/react";

import PageLayout from "@/components/page-layout";
import SubmitForm from "@/components/submit-form";
import ErrorMessage from "@/components/error-message";
import Header from "@/components/header";

export default function StreamPage() {
  // hook to handle the completion with streaming
  const {
    input,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    setInput,
    stop,
    error,
  } = useCompletion({
    api: "/api/stream",
  });

  return (
    <PageLayout>
      <div>
        <Header>Stream</Header>
        {isLoading && !completion ? <p>Loading...</p> : null}
        {completion ? <p>{completion}</p> : null}
        {error ? <ErrorMessage error={error?.message} /> : null}
      </div>
      <SubmitForm
        prompt={input}
        setPrompt={handleInputChange}
        isLoading={isLoading}
        handleSubmit={(e) => {
          handleSubmit(e); // clear the input after submission
          setInput("");
        }}
        stop={stop}
      />
    </PageLayout>
  );
}
