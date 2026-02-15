"use client";

import { Paperclip } from "lucide-react";
import { useRef, useState } from "react";

export default function SubmitForm({
  prompt,
  setPrompt,
  isLoading,
  handleSubmit,
  stop,
  placeholder = "Ask a question",
}: {
  prompt: string;
  setPrompt: (prompt: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  handleSubmit: (e: React.SubmitEvent) => void;
  stop?: () => void;
  placeholder?: string;
}) {
  return (
    <form
      className="border-t border-gray-300 p-2 w-full "
      onSubmit={handleSubmit}
    >
      <div className="flex flex-row gap-4 w-full items-center justify-center">
        <textarea
          value={prompt}
          placeholder={placeholder}
          className="focus:outline-none rounded p-2 w-[70%] scroll-auto "
          onChange={(e) => {
            setPrompt(e);
          }}
        />
        {stop && isLoading ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              stop();
            }}
            className="bg-red-500 text-white p-2 rounded border-gray-600"
          >
            Stop
          </button>
        ) : (
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 text-white p-2 rounded border-gray-600"
          >
            Send
          </button>
        )}
      </div>
    </form>
  );
}

export function FileForm({
  isLoading,
  handleSubmit,
  stop,
  placeholder = "Ask a question",
}: {
  isLoading: boolean;
  handleSubmit: ({
    prompt,
    files,
  }: {
    prompt: string;
    files?: FileList;
  }) => void;
  stop?: () => void;
  placeholder?: string;
}) {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  // files input ref
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="border-t border-gray-300 p-2 w-full "
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit({ prompt, files });

        // reset files
        if (fileRef.current) {
          fileRef.current.value = "";
        }
        setFiles(undefined);
        setPrompt("");
      }}
    >
      <div className="flex flex-row gap-4 w-full items-center justify-center">
        <label
          className="p-2 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors relative"
          htmlFor="file"
        >
          <Paperclip className="size-5" />
          {/* badge */}
          {files?.length ? (
            <div className="absolute -top-3 -right-3 rounded-full w-5 h-5 bg-orange-500 p-1.5 text-[.7rem] text-center flex items-center justify-center font-semibold">
              {files?.length}
            </div>
          ) : null}
        </label>
        <textarea
          value={prompt}
          placeholder={placeholder}
          className="focus:outline-none rounded p-2 w-[70%] scroll-auto "
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
        {stop && isLoading ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              stop?.();
            }}
            className="bg-red-500 text-white p-2 rounded border-gray-600"
          >
            Stop
          </button>
        ) : (
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 text-white p-2 rounded border-gray-600 hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        )}
      </div>
      <input
        type="file"
        className="hidden"
        ref={fileRef}
        onChange={(e) => {
          if (e.target.files) {
            setFiles(e.target.files);
          }
        }}
        id="file"
        multiple
      />
    </form>
  );
}
