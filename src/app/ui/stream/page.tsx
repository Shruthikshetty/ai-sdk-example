"use client";
import { useCompletion } from "@ai-sdk/react";

import PageLayout from "@/components/page-layout";
import SubmitForm from "@/components/submit-form";
import ErrorMessage from "@/components/error-message";

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
        <h1 className="text-xl font-bold mb-2 text-center">Stream Page</h1>
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
