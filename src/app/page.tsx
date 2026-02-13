import Link from "next/link";

// all links defined
const links = [
  {
    href: "/ui/completion",
    label: "1.Chat app with 1 message at a time",
  },
  {
    href: "/ui/stream",
    label: "2.Chat app with streaming",
  },
  {
    href: "/ui/chat",
    label: "3.Chat app with chat history",
  },
  {
    href: "/ui/code-bot",
    label: "4.Chat app with code bot (custom system prompting)",
  },
  {
    href: "/ui/structured-data",
    label: "5.Recipe bot (structured data)",
  },
  {
    href: "/ui/structured-array",
    label: "6.Pokemon bot (structured array)",
  },
  {
    href: "/ui/structured-enum",
    label: "7.Sentiment analysis (structured enum)",
  },
  {
    href: "/ui/multi-modal-chat",
    label: "8.Multi modal chat",
  },
  {
    href: "/ui/generate-image",
    label: "9.Generate image",
  },
  {
    href: "/ui/transcribe-audio",
    label: "10.Transcribe audio",
  },
  {
    href: "/ui/generate-speech",
    label: "11.Generate speech",
  },
  {
    href: "/ui/tools",
    label: "12.Tools chat",
  },
  {
    href: "/ui/api-tools",
    label: "13.API Tools chat (real weather data)",
  },
];

// main landing screen
export default function Home() {
  return (
    <div className="flex h-screen w-screen p-10 flex-col">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-2xl text-blue-600 hover:underline text-left w-full scrollbar-thin scrollbar-thumb-gray-400"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
