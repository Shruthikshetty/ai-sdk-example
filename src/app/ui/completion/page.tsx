"use client";

export default function Completion() {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-between p-10">
      {/* display area for completion  */}
      <div></div>

      <form className="border-t border-gray-300 p-2 ">
        <div className="flex flex-row gap-4">
          <input
            type="text"
            placeholder="Ask a question"
            className="focus:outline-none rounded p-2 "
          />
          <button
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
