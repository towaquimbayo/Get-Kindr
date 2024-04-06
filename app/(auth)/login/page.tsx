"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { InputField, PasswordField } from "@/components/layout/fields";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/layout/button";
import AlertMessage from "@/components/layout/alertMessage";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (session && status === "authenticated") router.push("/");
  }, [session, router, status]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const data = {
      email: form.get("email")?.toString().trim() ?? "",
      password: form.get("password")?.toString().trim() ?? "",
    };

    if (!data.email || !data.password) {
      setErrorMsg("Please enter an email and password.");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    console.log("Login Response: ", res);

    if (!res) {
      setErrorMsg("An error occurred. Please try again.");
    } else if (res.error) {
      setErrorMsg(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-full w-full">
      <div className="m-auto flex  w-full max-w-screen-sm flex-col items-center justify-center px-4 py-8 lg:w-2/3">
        <Link href="/" className="mb-10 flex w-full sm:mb-20">
          <Image
            src="/get_KINDR_logo.png"
            alt="get kindr logo"
            width="150"
            height="150"
            style={{ objectFit: "contain" }}
            className="mr-2"
          />
        </Link>
        <h1 className="mb-16 text-center text-secondary font-display text-4xl font-bold md:text-5xl">
          Welcome back
        </h1>
        <div className="flex w-full rounded-lg border border-[#eaeaea]">
          <div
            className="flex w-1/2 cursor-pointer items-center justify-center gap-2 p-4"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <Image
              src="/google-logo.png"
              alt="Google icon"
              width="25"
              height="25"
              style={{ objectFit: "contain" }}
              className="mr-2"
            />
            <span className="text-md hidden sm:flex">Sign in with Google</span>
          </div>
          <div className="my-4 border-r border-[#eaeaea]" />
          <div
            className="flex w-1/2 cursor-pointer items-center justify-center gap-2 p-4"
            onClick={() => signIn("facebook")}
          >
            <Image
              src="/facebook-logo.png"
              alt="Facebook icon"
              width="25"
              height="25"
              style={{ objectFit: "contain" }}
              className="mr-2"
            />
            <span className="text-md hidden sm:flex">
              Sign in with Facebook
            </span>
          </div>
        </div>
        <div className="my-10 flex w-full justify-between">
          <hr className="my-auto h-px w-48 border-0 bg-[#EAEAEA]" />
          <p className="px-8 text-sm text-secondary">OR</p>
          <hr className="my-auto h-px w-48 border-0 bg-[#EAEAEA]" />
        </div>
        {errorMsg && <AlertMessage message={errorMsg} />}
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col space-y-4"
        >
          <InputField
            id="email"
            name="email"
            type="email"
            label="Email"
            minLength={3}
            maxLength={100}
            placeholder="example@email.com"
            onChange={() => setErrorMsg("")}
          />
          <PasswordField
            id="password"
            name="password"
            label="Password"
            minLength={8}
            maxLength={50}
            onChange={() => setErrorMsg("")}
          />
          <div className="flex w-full text-sm pb-2">
            <Link href="/forgot-password" className="text-[#858585]">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" loading={loading} text="Login" full />
        </form>
        <p className="pt-6">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-primary">
            Sign Up
          </Link>{" "}
        </p>
      </div>
      <div className="relative hidden min-h-screen w-1/2 lg:flex">
        <div className="relative z-10 h-auto w-full bg-black bg-opacity-30" />
        <Image
          src="/auth-support-image.jpg"
          alt="2 females hug each other in support of each other."
          style={{ objectFit: "cover", objectPosition: "center" }}
          fill
        />
      </div>
    </div>
  );
}
