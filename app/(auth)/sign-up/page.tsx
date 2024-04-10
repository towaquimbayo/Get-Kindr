"use client";

import { FormEvent, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  InputField,
  PasswordField,
  ToggleField,
} from "@/components/layout/fields";
import Button from "@/components/layout/button";
import AlertMessage from "@/components/layout/alertMessage";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "@/components/shared/validations";

export default function Signup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOrganization, setIsOrganization] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (session && status === "authenticated") router.push("/");
  }, [session, router, status]);

  function clearErrors(fieldName: string) {
    setErrorMsg("");
    setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
  }

  function validateForm({
    email,
    password,
    firstName,
    lastName,
    organizationName,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName: string;
  }) {
    if (
      (isOrganization && !organizationName) ||
      (!isOrganization && (!firstName || !lastName)) ||
      !email ||
      !password
    ) {
      setErrorMsg("Please fill out all mandatory fields.");
      setLoading(false);
      return false;
    } else if (!validateEmail(email, setFieldErrors, "email")) {
      setLoading(false);
      return false;
    } else if (
      isOrganization &&
      !validateName(organizationName, setFieldErrors, "organizationName")
    ) {
      setLoading(false);
      return false;
    } else if (
      !isOrganization &&
      (!validateName(firstName, setFieldErrors, "firstName") ||
        !validateName(lastName, setFieldErrors, "lastName"))
    ) {
      setLoading(false);
      return false;
    } else if (!validatePassword(password, setFieldErrors, "password")) {
      setLoading(false);
      return false;
    }
    return true;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setFieldErrors({});
    setSuccessMsg("");

    const form = new FormData(e.currentTarget);
    const data = {
      firstName: form.get("firstName")?.toString().trim() ?? "",
      lastName: form.get("lastName")?.toString().trim() ?? "",
      organizationName: form.get("organizationName")?.toString().trim() ?? "",
      email: form.get("email")?.toString().trim() ?? "",
      password: form.get("password")?.toString().trim() ?? "",
      isOrganization: isOrganization,
    };

    if (!validateForm(data)) return;

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);

    console.log("Signup Response: ", res);
    if (!res) {
      setErrorMsg("An error occurred. Please try again.");
    } else if (res.ok) {
      setSuccessMsg("Account created successfully. Redirecting to login...");
      setTimeout(() => router.push("/login"), 3000);
    } else {
      const error = await res.json();
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="flex h-full w-full">
      <div className="m-auto flex  w-full max-w-screen-sm flex-col items-center justify-center px-4 py-8 lg:w-2/3">
        <Link href="/" className="mb-10 flex w-full sm:mb-20">
          <Image
            src="/get_KINDR_logo.png"
            alt="Get KINDR logo"
            width="150"
            height="150"
            style={{ objectFit: "contain" }}
            className="mr-2"
          />
        </Link>
        <h1 className="mb-16 text-center font-display text-4xl font-bold text-secondary md:text-5xl">
          Lets Get Kindr
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
          <p className="px-8 text-sm text-secondary">OR</p>
          <hr className="my-auto h-px w-48 border-0 bg-[#EAEAEA]" />
        </div>
        {errorMsg && <AlertMessage message={errorMsg} />}
        {successMsg && <AlertMessage message={successMsg} type="success" />}
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
              minLength={2}
              maxLength={50}
              onChange={() => setErrorMsg("")}
              error={
                (fieldErrors as { organizationName?: string })?.organizationName
              }
            />
          ) : (
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
              <InputField
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                onChange={() => clearErrors("firstName")}
                minLength={2}
                maxLength={50}
                error={(fieldErrors as { firstName?: string })?.firstName}
              />
              <InputField
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                minLength={2}
                maxLength={50}
                onChange={() => clearErrors("lastName")}
                error={(fieldErrors as { lastName?: string })?.lastName}
              />
            </div>
          )}
          <InputField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="example@email.com"
            minLength={3}
            maxLength={100}
            onChange={() => clearErrors("email")}
            error={(fieldErrors as { email?: string })?.email}
          />
          <PasswordField
            id="password"
            name="password"
            label="Password"
            minLength={8}
            maxLength={50}
            onChange={() => clearErrors("password")}
            error={(fieldErrors as { password?: string })?.password}
          />
          <ToggleField
            id="organization"
            name="organization"
            label="I am an Organization"
            onChange={() => {
              setErrorMsg("");
              setIsOrganization(!isOrganization);
            }}
          />
          <Button type="submit" loading={loading} text="Sign Up" full />
        </form>
        <p className="pt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Login
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
