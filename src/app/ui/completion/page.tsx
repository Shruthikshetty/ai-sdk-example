"use client";

import axios from "axios";
import { useState } from "react";
import { ApiErrorResponse } from "../../../../types";
import PageLayout from "@/components/page-layout";
import SubmitForm from "@/components/submit-form";
import ErrorMessage from "@/components/error-message";

export default function Completion() {
  const [prompt, setPrompt] = useState(""); // user input
  const [completion, setCompletion] = useState(""); // ai response
  const [isLoading, setIsLoading] = useState(false); // loading state
  const [error, setError] = useState<string | null>(null); // error state

  // function to handle form submission
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/completion", { prompt });
      setCompletion(response.data?.text ?? "");
      setError(null);
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      const axiosError = error as ApiErrorResponse;
      setError(
        axiosError?.response?.data?.error ||
          axiosError?.message ||
          "Something went wrong",
      );
    } finally {
      setIsLoading(false);
      // clear the input after submission
      setPrompt("");
    }
  };

  return (
    <PageLayout>
      {/* display area for completion  */}
      <div>
        {error ? <ErrorMessage error={error} /> : null}
        {isLoading ? <p>Loading...</p> : null}
        {completion && !isLoading && !error ? <p>{completion}</p> : null}
      </div>

      <SubmitForm
        prompt={prompt}
        setPrompt={(e) => setPrompt(e.target.value)}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </PageLayout>
  );
}
