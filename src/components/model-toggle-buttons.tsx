"use client";
export default function ModelToggleButtons({
  buttons,
  selected,
  setSelected,
}: {
  buttons: string[];
  selected: string;
  setSelected: (selected: string) => void;
}) {
  return (
    <div className="flex justify-center w-full my-4">
      <div className="p-1 rounded-lg bg-gray-800/50 border border-gray-700 inline-flex flex-row gap-1 self-center">
        {buttons.map((button) => (
          <button
            key={button}
            className={
              "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 capitalize " +
              (selected === button
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50")
            }
            onClick={() => setSelected(button)}
          >
            {button}
          </button>
        ))}
      </div>
    </div>
  );
}
