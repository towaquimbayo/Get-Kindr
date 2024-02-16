"use client";

import { FormEvent, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InputField, ToggleField } from "@/components/layout/fields";

export default function Signup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOrganization, setIsOrganization] = useState(false);

  useEffect(() => {
    if (session && status === "authenticated") router.push("/");
  }, [session, router, status]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = {
      firstName: form.get("firstName")?.toString().trim() || null,
      lastName: form.get("lastName")?.toString().trim() || null,
      organizationName: form.get("organizationName")?.toString().trim() || null,
      email: form.get("email")?.toString().trim(),
      password: form.get("password")?.toString().trim(),
      isOrganization: isOrganization,
    };

    // TODO: Add form validations
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);

    console.log("Signup Response: ", res);
    if (res.ok) router.push("/login");
    else {
      const error = await res.json();
      const errorMsg = error?.message || "Signup failed";
      const errorMsgElement = document.getElementById("errorMsg");
      if (errorMsgElement) errorMsgElement.textContent = errorMsg;
      console.error("Signup failed");
    }
  };

  return (
    <div className="flex h-full w-full">
      <div className="m-auto flex  w-full max-w-screen-sm flex-col items-center justify-center px-4 py-8 lg:w-2/3">
        <Link href="/" className="mb-10 flex w-full sm:mb-20">
          <Image
            src="/kindr_logo.png"
            alt="KINDR logo"
            width="120"
            height="120"
            style={{ objectFit: "contain" }}
            className="mr-2"
          />
        </Link>
        <h1 className="mb-16 text-center font-display text-4xl font-bold md:text-5xl">
          Get Started with KINDR
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
              style={{ objectFit: "contain" }}
              className="mr-2"
            />
            <span className="text-md hidden sm:flex">Sign up with Google</span>
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
              Sign up with Facebook
            </span>
          </div>
        </div>
        <div className="my-10 flex w-full justify-between">
          <hr className="my-auto h-px w-48 border-0 bg-[#EAEAEA]" />
          <p className="px-8 text-sm text-black">OR</p>
          <hr className="my-auto h-px w-48 border-0 bg-[#EAEAEA]" />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col space-y-4"
        >
          {isOrganization ? (
            <InputField
              id="organizationName"
              name="organizationName"
              type="text"
              label="Organization Name"
            />
          ) : (
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
              <InputField
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
              />
              <InputField
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
              />
            </div>
          )}
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
          <ToggleField
            id="organization"
            name="organization"
            label="I am an Organization"
            onChange={() => {
              setIsOrganization(!isOrganization);
            }}
          />
          <button
            type="submit"
            className="text-md h-12 w-full rounded-md bg-primary text-white focus:outline-none"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <p id="errorMsg" className="text-red-500 text-center" />
        </form>
        <p className="pt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Login
          </Link>{" "}
        </p>
      </div>
      <div className="relative hidden h-screen w-1/2 lg:flex">
        <div className="relative z-10 h-full w-full bg-black bg-opacity-30" />
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
