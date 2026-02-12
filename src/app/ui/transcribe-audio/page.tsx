"use client";
import ErrorMessage from "@/components/error-message";
import Header from "@/components/header";
import PageLayout from "@/components/page-layout";
import axios from "axios";
import { useRef, useState } from "react";
import { ApiErrorResponse } from "../../../../types";

type TranscriptResult = {
  text: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  language?: string;
  durationInSeconds?: number;
};

export default function TranscribeAudioPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTranscript(null);

    // check if audio file is selected
    if (!audioFile) {
      setError("Please upload an audio file");
      return;
    }
    // make request to api
    try {
      const formdata = new FormData();
      formdata.append("audio", audioFile);
      const response = await axios.post("/api/transcribe-audio", formdata);
      const data = response.data;

      if (data.error) {
        setError(data.error);
      } else {
        setTranscript(data.transcript);
      }
    } catch (error) {
      const axiosError = error as ApiErrorResponse;
      setError(
        axiosError?.response?.data?.error ||
          axiosError?.message ||
          "Something went wrong",
      );
    } finally {
      setIsLoading(false);
      // reset files
      if (audioRef.current) {
        audioRef.current.value = "";
      }
      setAudioFile(null);
    }
  };

  return (
    <PageLayout>
      {/* display area for completion  */}
      <div>
        <Header>Audio Transcription</Header>
        {error ? <ErrorMessage error={error} /> : null}
        {isLoading ? <p>Loading...</p> : null}

        {/* result */}
        {transcript && !isLoading && (
          <div className="bg-gray-600 p-2 rounded-lg">
            <h1 className="text-xl font-bold mb-2">Transcript :-</h1>
            <p>{transcript.text}</p>
            {transcript?.durationInSeconds && (
              <p>Duration: {transcript.durationInSeconds} seconds</p>
            )}
            {transcript?.language && <p>Language: {transcript.language}</p>}
          </div>
        )}
      </div>

      <form
        className="border-t border-gray-300 p-2 w-full flex flex-row items-center justify-center gap-5"
        onSubmit={handleSubmit}
      >
        <label htmlFor="audio" className="cursor-pointer">
          Upload Audio File
          {audioFile && <p>Selected file: {audioFile.name}</p>}
        </label>
        <input
          ref={audioRef}
          className="hidden"
          type="file"
          id="audio"
          name="audio"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
        />
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-500 p-2 rounded border-gray-600 hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </form>
    </PageLayout>
  );
}
