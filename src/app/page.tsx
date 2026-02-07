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
];

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
