"use client";

import Button from "@/components/layout/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Image
        src="/404error.svg"
        alt="404 Error"
        style={{ objectFit: "cover", objectPosition: "center" }}
        width={800}
        height={800}
      />
      <h1 className="text-3xl font-bold sm:text-4xl text-secondary">Oops! Are you lost?</h1>
      <Button
        onClick={() => router.push("/")}
        text="Return to Home"
        className="mx-auto mt-8"
      >
          Return to Home
      </Button>
    </div>
  );
}
