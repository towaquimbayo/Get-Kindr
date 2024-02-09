import Footer from "@/components/layout/footer";
import Nav from "@/components/layout/nav";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="flex min-h-screen w-full flex-col items-center justify-center md:pt-16 ">
        {children}
      </main>
      <Footer />
    </>
  );
}
