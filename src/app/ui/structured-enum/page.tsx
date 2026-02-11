"use client";
import Header from "@/components/header";
import PageLayout from "@/components/page-layout";
import SubmitForm from "@/components/submit-form";
import { useState } from "react";
import { ApiErrorResponse } from "../../../../types";
import axios from "axios";
import ErrorMessage from "@/components/error-message";

export default function StructuredEnumPage() {
  const [prompt, setPrompt] = useState(""); // user input
  const [sentiment, setSentiment] = useState(""); // ai response
  const [isLoading, setIsLoading] = useState(false); // loading state
  const [error, setError] = useState<string | null>(null); // error state

  // function to handle submit
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post<{
        text: string;
      }>("/api/structured-enum", { text: prompt });
      setSentiment(JSON.parse(response.data?.text)?.result ?? "not classified");
    } catch (error) {
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
      <Header>Sentiment Analysis</Header>
      {/* result  */}
      <div>
        {error ? <ErrorMessage error={error} /> : null}
        {isLoading ? <p>Loading...</p> : null}
        {sentiment && !isLoading && !error ? (
          <p>
            The text you provided is classified as{" "}
            <b className="text-blue-600 text-2xl">{sentiment}</b>
          </p>
        ) : null}
      </div>
      {/* form */}
      <SubmitForm
        prompt={prompt}
        setPrompt={(e) => setPrompt(e.target.value)}
        isLoading={isLoading}
        placeholder="type your sentence to be classified"
        handleSubmit={handleSubmit}
      />
    </PageLayout>
  );
}
