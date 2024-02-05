"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import InputField from "@/components/layout/fields";

export default function Login() {
  return (
    <div className="flex h-full w-full">
      <div className="flex w-2/3 flex-col items-center justify-center px-32">
        <Link href="/" className="mb-20 flex w-full">
          <Image
            src="/kindr_logo.png"
            alt="KINDR logo"
            width="120"
            height="120"
            objectFit="contain"
            className="mr-2"
          />
        </Link>
        <h1 className="mb-16 text-center font-display text-5xl font-bold">
          Welcome back
        </h1>
        <div className="flex w-full rounded-lg border border-[#eaeaea]">
          <div
            className="flex w-1/2 cursor-pointer items-center justify-center gap-2 p-4"
            onClick={() => signIn("google")}
          >
            <Image
              src="/google-logo.png"
              alt="Google icon"
              width="25"
              height="25"
              objectFit="contain"
              className="mr-2"
            />
            <span className="text-md">Sign in with Google</span>
          </div>
          <div className="my-4 border-r border-[#eaeaea]" />
          <div
            className="flex w-1/2 cursor-pointer items-center justify-center gap-2 p-4"
            // onClick={() => signIn("facebook")}
          >
            <Image
              src="/facebook-logo.png"
              alt="Facebook icon"
              width="25"
              height="25"
              objectFit="contain"
              className="mr-2"
            />
            <span className="text-md">Sign in with Facebook</span>
          </div>
        </div>
        <div className="my-10 flex w-full justify-between">
          <hr className="my-auto h-px w-48 border-0 bg-[#EAEAEA]" />
          <p className="px-8 text-sm text-black">OR</p>
          <hr className="my-auto h-px w-48 border-0 bg-[#EAEAEA]" />
        </div>
        <form action="POST" className="flex w-full flex-col space-y-4">
          <InputField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="example@email.com"
          />
          <InputField
            id="password"
            name="password"
            type="password"
            label="Password"
          />
          <button
            type="submit"
            className="text-md h-12 w-full rounded-md bg-primary text-white focus:outline-none"
          >
            Login
          </button>
        </form>
        <p className="pt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary">
            Sign Up
          </Link>{" "}
        </p>
      </div>
      <div className="relative h-screen w-1/2">
        <div className="relative z-10 h-full w-full bg-black bg-opacity-30" />
        <Image
          src="/auth-support-image.jpg"
          alt="2 females hug each other in support of each other."
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
    </div>
  );
}