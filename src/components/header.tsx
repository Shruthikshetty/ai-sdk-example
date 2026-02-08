export default function Header({ children }: { children: React.ReactNode }) {
  return <h1 className="text-xl font-bold mb-2 text-center">{children}</h1>;
}
