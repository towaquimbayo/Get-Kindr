import Nav from "@/components/layout/nav";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="flex min-h-screen w-full flex-col items-center justify-start">
        {children}
      </main>
    </>
  );
}
