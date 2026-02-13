"use client";
import ErrorMessage from "@/components/error-message";
import PageLayout from "@/components/page-layout";
import Spinner from "@/components/spinner";
import SubmitForm from "@/components/submit-form";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ApiErrorResponse } from "../../../../types";
import Header from "@/components/header";

export default function GenerateSpeech() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAudio, setHasAudio] = useState(false);
  const audioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  //handler form submit
  const handleFormSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // audio states reset
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current!);
      audioUrlRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    setHasAudio(false);

    // make api call
    axios
      .post(
        "/api/generate-speech",
        { text: input },
        {
          responseType: "blob",
        },
      )
      .then((response) => {
        const blob = response.data;
        audioUrlRef.current = URL.createObjectURL(blob);
        audioRef.current = new Audio(audioUrlRef.current);
        audioRef.current.play();
        setHasAudio(true);
      })
      .catch((error) => {
        const axiosError = error as ApiErrorResponse;
        setError(
          axiosError?.response?.data?.error ||
            axiosError?.message ||
            "Something went wrong",
        );
        setHasAudio(false);
      })
      .finally(() => {
        setIsLoading(false);
        // reset input
        setInput("");
      });
  };

  // function to replay audio
  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // clean up
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current!);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  return (
    <PageLayout>
      <div className="w-full flex-1 flex flex-col overflow-y-auto min-h-0 thin-scroll pr-2">
        <Header>Generate Speech</Header>
        {error ? <ErrorMessage error={error} /> : null}
        {isLoading ? <Spinner /> : null}
        {hasAudio && !isLoading ? (
          <button
            onClick={replayAudio}
            className="bg-blue-500 transition-colors hover:bg-blue-600 p-2 rounded-xl"
          >
            Replay Audio
          </button>
        ) : null}
      </div>
      <SubmitForm
        prompt={input}
        setPrompt={(e) => setInput(e.target.value)}
        isLoading={isLoading}
        handleSubmit={handleFormSubmit}
        placeholder="Enter text to generate speech"
      />
    </PageLayout>
  );
}
