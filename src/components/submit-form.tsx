"use client";
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
            onClick={stop}
            className="bg-red-500 p-2 rounded border-gray-600"
          >
            Stop
          </button>
        ) : (
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 p-2 rounded border-gray-600"
          >
            Send
          </button>
        )}
      </div>
    </form>
  );
}
