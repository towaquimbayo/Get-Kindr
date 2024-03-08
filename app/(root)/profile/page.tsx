"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/layout/button";
import { Edit } from "lucide-react";
import AlertMessage from "@/components/layout/alertMessage";
import { InputField, PasswordField } from "@/components/layout/fields";
import Link from "next/link";

export default function Profile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const {
    email,
    image,
    name,
    tokens,
    volunteerHours,
  }: {
    email?: string | null;
    image?: string | null;
    name?: string | null;
    tokens?: number;
    volunteerHours?: number;
  } = session?.user || {};
  const userTokens = tokens || 0;
  const userVolHours = volunteerHours || 0;

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOrganization, setIsOrganization] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formValues, setFormValues] = useState({
    firstName: name?.split(" ")[0] || "",
    lastName: name?.split(" ")[1] || "",
    organizationName: name || "",
    email: email || "",
    phone: "",
  });

  useEffect(() => {
    if (!session || status !== "authenticated") router.push("/login");
  }, [session, status, router]);

  useEffect(() => {
    // @TODO: Make API call to get user details
    // setFormValues({ ...userDetails });
  }, []);

  function clearErrors(fieldName: string) {
    setErrorMsg("");
    setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
  }

  // Create section components for the profile page
  function ProfileSection({
    sectionHeading = "",
    editFields = false,
    children,
  }: {
    sectionHeading?: string;
    editFields?: boolean;
    children: React.ReactNode;
  }) {
    return (
      <div className="my-4 flex flex-col rounded-lg border border-[#EAEAEA]">
        {sectionHeading && (
          <div className="flex w-full justify-between border-b px-6 py-6">
            <h1 className="text-xl font-semibold">{sectionHeading}</h1>
            {editFields && (
              <div
                className="flex cursor-pointer items-center gap-2 self-center font-semibold text-secondary hover:opacity-80"
                onClick={() => {
                  // @TODO: make fields editable
                }}
              >
                <p>Edit</p>
                <Edit size={20} />
              </div>
            )}
          </div>
        )}
        <div className="px-6 py-8">{children}</div>
      </div>
    );
  }

  async function updateAccountDetails(e: React.FormEvent<HTMLFormElement>) {
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

    console.log("Account Details: ", data);

    // @TODO: Validate form fields
    // @TODO: Make API call to update user details
    // @TODO: Handle response and update state accordingly
  }

  function AccountDetailsForm() {
    return (
      <>
        {errorMsg && <AlertMessage message={errorMsg} />}
        {successMsg && <AlertMessage message={successMsg} type="success" />}
        <form
          onSubmit={updateAccountDetails}
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
              currentValue={formValues?.organizationName}
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
                currentValue={formValues?.firstName}
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
                currentValue={formValues?.lastName}
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
            currentValue={formValues?.email}
            error={(fieldErrors as { email?: string })?.email}
          />
          {/* <PasswordField
            id="password"
            name="password"
            label="Password"
            minLength={8}
            maxLength={50}
            onChange={() => clearErrors("password")}
            error={(fieldErrors as { password?: string })?.password}
          /> */}
          <Button
            type="submit"
            loading={loading}
            text="Save Changes"
            disabled
          />
        </form>
      </>
    );
  }

  return (
    <div className="mx-auto mb-auto mt-28 flex w-full max-w-screen-xl gap-8 p-8">
      <div className="flex w-1/3 flex-col">
        <ProfileSection>
          <div className="mb-4 flex justify-center">
            <Image
              src={image || "/default_profile_img.png"}
              alt="Profile Picture"
              width="100"
              height="100"
              className="rounded-full"
            />
          </div>
          <h1 className="my-4 flex text-xl">
            Hello, <span className="font-semibold text-primary">{name}!</span>
          </h1>
          <div className="mb-6 flex">
            <div className="flex w-full justify-between">
              <p className="text-sm text-[#4b4b4b]">
                Tokens:{" "}
                <span className="font-semibold text-black">{userTokens}</span>
              </p>
              <p className="text-sm text-[#4b4b4b]">
                Volunteered:{" "}
                <span className="font-semibold text-black">
                  {userVolHours}h
                </span>
              </p>
            </div>
          </div>
          <Button
            title="Terminate Account"
            text="Terminate Account"
            onClick={() => {
              // @TODO: Add terminate account functionality
              // update({ redirect: false });
            }}
            full
          />
        </ProfileSection>
        <ProfileSection>
          <h1 className="mb-4 text-xl font-semibold">Need assistance?</h1>
          <p className="mb-8">
            Got questions with your account or recent volunteer events? Our
            support team is here to help! Whether it&apos;s account
            troubleshooting or event details, just shoot us an email. Your
            satisfaction is our priority!
          </p>
          <Button
            title="Send email to support@getkindr.com"
            text="Email Us"
            onClick={() => {
              window.open("mailto:supportgetkindr.com");
            }}
            full
            outline
          />
        </ProfileSection>
      </div>
      <div className="flex w-2/3 flex-col">
        <ProfileSection sectionHeading="Account details" editFields>
          <AccountDetailsForm />
        </ProfileSection>
        {isOrganization ? (
          <ProfileSection sectionHeading="Hosted events">
            <p>
              To create, view, or edit your current and past hosted events,
              please visit your{" "}
              <Link
                href="/my-events"
                className="font-semibold text-primary hover:opacity-80"
              >
                hosted events here.
              </Link>
            </p>
          </ProfileSection>
        ) : (
          <ProfileSection sectionHeading="Attended events">
            <p>
              To view, manage, and keep track of your past volunteer events and
              hours, please visit your{" "}
              <Link
                href="/my-events"
                className="font-semibold text-primary hover:opacity-80"
              >
                attended events here.
              </Link>
            </p>
          </ProfileSection>
        )}
      </div>
    </div>
  );
}
