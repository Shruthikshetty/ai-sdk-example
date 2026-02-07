"use client";

import axios from "axios";
import { useState } from "react";

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
    }
  };

  return (
    <div className="flex flex-col h-screen w-full items-center justify-between p-10">
      {/* display area for completion  */}
      <div>
        {error ? <p className="text-red-500">{error}</p> : null}
        {isLoading ? <p>Loading...</p> : null}
        {completion && !isLoading && !error ? <p>{completion}</p> : null}
      </div>

      <form className="border-t border-gray-300 p-2" onSubmit={handleSubmit}>
        <div className="flex flex-row gap-4">
          <input
            type="text"
            value={prompt}
            placeholder="Ask a question"
            className="focus:outline-none rounded p-2"
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 p-2 rounded border-gray-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
