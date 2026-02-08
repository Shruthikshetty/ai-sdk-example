export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-between px-[10%] py-5 ">
      {children}
    </div>
  );
}
