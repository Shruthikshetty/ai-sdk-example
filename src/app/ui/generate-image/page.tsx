"use client";
import ErrorMessage from "@/components/error-message";
import Header from "@/components/header";
import PageLayout from "@/components/page-layout";
import SubmitForm from "@/components/submit-form";
import axios from "axios";
import { useState } from "react";
import { ApiErrorResponse } from "../../../../types";
import Image from "next/image";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // handle form submission
  const handleSubmit = async (e: React.SubmitEvent) => {
    // prevent default form submission
    e.preventDefault();
    // set loading
    setIsLoading(true);
    // clear error and image
    setError(null);
    setImgSrc(null);
    try {
      const response = await axios.post("/api/generate-image", { prompt });
      setImgSrc(`data:image/png;base64,${response.data?.image}`);
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
      setPrompt("");
    }
  };
  return (
    <PageLayout>
      {/* display area for completion  */}
      <div>
        <Header>Image Generator</Header>
        {error ? <ErrorMessage error={error} /> : null}
        {isLoading ? <p>Loading...</p> : null}
        {/* image */}
        {imgSrc && !isLoading && !error ? (
          <Image src={imgSrc} alt="generated image" width={500} height={500} />
        ) : null}
      </div>

      <SubmitForm
        prompt={prompt}
        setPrompt={(e) => setPrompt(e.target.value)}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        placeholder="describe the image"
      />
    </PageLayout>
  );
}
