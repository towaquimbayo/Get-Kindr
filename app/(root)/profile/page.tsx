"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/layout/button";
import { Edit } from "lucide-react";
import AlertMessage from "@/components/layout/alertMessage";
import {
  InputField,
  PasswordField,
  PhoneField,
} from "@/components/layout/fields";
import Link from "next/link";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "@/components/shared/validations";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    email,
    image,
    name,
  }: {
    email?: string | null;
    image?: string | null;
    name?: string | null;
  } = session?.user || {};
  const {
    accountProvider,
    accountType,
  }: {
    accountProvider?: string | null;
    accountType?: string | null;
  } = session || {};
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const isOrganization = accountType?.toLowerCase() === "organization";
  const [fieldErrors, setFieldErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [profileImg, setProfileImg] = useState(image);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    organizationName: "",
    email: "",
    phone: "",
    password: "",
    tokenBalance: 0,
    volunteerHours: 0,
    orgHostedEvents: 0,
  });

  useEffect(() => {
    if (!session || status !== "authenticated") router.push("/login");
  }, [session, status, router]);

  useEffect(() => {
    async function getUserDetails() {
      const url = encodeURIComponent(email || "");
      const res = await fetch(`/api/auth?email=${url}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      console.log("GET Response Details: ", res);

      if (!res.ok) {
        const error = await res.json();
        setErrorMsg(error.message);
        return;
      }

      const jsonRes = await res.json();
      const userInfo = jsonRes.user;
      console.log("User Details: ", userInfo);

      if (!userInfo) {
        setErrorMsg("User not found.");
        return;
      }

      // set account type and user data
      setUserData(userInfo);
      setIsFetching(false);
    }

    if (email) getUserDetails();
  }, [email]);

  // Create section components for the profile page
  function ProfileSection({
    sectionHeading = "",
    editFields = false,
    children,
  }: {
    sectionHeading?: string;
    editFields?: boolean;
    children: ReactNode;
  }) {
    return (
      <div className="my-4 flex w-full flex-col rounded-lg border border-[#EAEAEA]">
        {sectionHeading && (
          <div className="flex w-full justify-between border-b px-6 py-6">
            <h1 className="text-xl font-semibold">{sectionHeading}</h1>
            {editFields && (
              <div
                className={`flex cursor-pointer items-center gap-2 self-center font-semibold ${
                  isFetching ? "text-[#858585]" : "text-secondary"
                } hover:opacity-80`}
                onClick={() => {
                  if (!isFetching) {
                    setIsEditing((prev) => !prev);
                    setFieldErrors({});
                    setErrorMsg("");
                    setSuccessMsg("");
                    setInfoMsg("");
                  }
                }}
              >
                {isEditing ? (
                  <p>Cancel</p>
                ) : (
                  <>
                    <p>Edit</p>
                    <Edit size={20} />
                  </>
                )}
              </div>
            )}
          </div>
        )}
        <div className="px-6 py-8">{children}</div>
      </div>
    );
  }

  function validateForm({
    organizationName,
    firstName,
    lastName,
    email,
    phone,
    password,
  }: {
    organizationName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    if (
      (isOrganization && !organizationName) ||
      (!isOrganization && (!firstName || !lastName)) ||
      !email
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
    } else if (!validatePhone(phone, setFieldErrors, "phone")) {
      setLoading(false);
      return false;
    } else if (
      password &&
      !validatePassword(password, setFieldErrors, "password")
    ) {
      // only validate password if it's not empty
      setLoading(false);
      return false;
    }
    return true;
  }

  async function updateAccountDetails(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setFieldErrors({});
    setSuccessMsg("");

    const form = new FormData(e.currentTarget);
    const data = {
      organizationName: form.get("organizationName")?.toString().trim() ?? "",
      firstName: form.get("firstName")?.toString().trim() ?? "",
      lastName: form.get("lastName")?.toString().trim() ?? "",
      email: form.get("email")?.toString().trim() ?? "",
      phone: form.get("phone")?.toString().replace(/\D/g, "").trim() ?? "",
      password: form.get("password")?.toString().trim() ?? "",
      isOrganization: isOrganization,
      userEmail: email, // user's current email
      tokenBalance: userData.tokenBalance,
      volunteerHours: userData.volunteerHours,
      orgHostedEvents: userData.orgHostedEvents,
    };
    console.log("Profile Details: ", data);

    // validate form data
    if (!validateForm(data)) return;

    setUserData(data);

    // if no updates were made, return
    if (
      ((isOrganization &&
        data.organizationName === userData.organizationName) ||
        (!isOrganization &&
          data.firstName === userData.firstName &&
          data.lastName === userData.lastName)) &&
      data.email === userData.email &&
      data.phone === userData.phone &&
      !data.password // password empty indicates no changes made
    ) {
      setInfoMsg("Hmm... no changes were made.");
      setLoading(false);
      setIsEditing(false);
      setTimeout(() => setInfoMsg(""), 3000);
      return;
    }

    console.log("Sending update request: ", data);

    const res = await fetch("/api/auth/update/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);

    console.log("Profile update Response: ", res);
    if (!res) {
      setErrorMsg("An error occurred. Please try again.");
    } else if (res.ok) {
      setSuccessMsg("Profile updated successfully. Redirecting to login...");
      setTimeout(() => signOut({ callbackUrl: "/login" }), 3000);
    } else {
      const error = await res.json();
      setErrorMsg(error.message);
    }
  }

  function AccountDetailsForm() {
    return (
      <>
        {errorMsg && <AlertMessage message={errorMsg} />}
        {successMsg && <AlertMessage message={successMsg} type="success" />}
        {infoMsg && <AlertMessage message={infoMsg} type="info" />}
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
              defaultValue={userData.organizationName}
              error={
                (fieldErrors as { organizationName?: string })?.organizationName
              }
              disabled={!isEditing}
            />
          ) : (
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
              <InputField
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                minLength={2}
                maxLength={50}
                defaultValue={userData.firstName}
                error={(fieldErrors as { firstName?: string })?.firstName}
                disabled={!isEditing}
              />
              <InputField
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                minLength={2}
                maxLength={50}
                defaultValue={userData.lastName}
                error={(fieldErrors as { lastName?: string })?.lastName}
                disabled={!isEditing}
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
            defaultValue={userData.email}
            error={(fieldErrors as { email?: string })?.email}
            disabled={!isEditing}
          />
          <PhoneField
            id="phone"
            name="phone"
            label="Phone"
            defaultValue={userData.phone}
            error={(fieldErrors as { phone?: string })?.phone}
            disabled={!isEditing}
            optional
          />
          {accountProvider === "credentials" && (
            <PasswordField
              id="password"
              name="password"
              label="Password"
              minLength={8}
              maxLength={50}
              defaultValue={userData.password}
              error={(fieldErrors as { password?: string })?.password}
              disabled={!isEditing}
            />
          )}
          {isEditing && (
            <Button type="submit" loading={loading} text="Save Changes" />
          )}
        </form>
      </>
    );
  }

  async function UploadImage(base64Image: string) {
    // remove data:image/png;base64, from base64 string
    const formattedBase64 = base64Image.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      "",
    );
    const formData = new FormData();
    formData.append("image", formattedBase64);

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    const res = await fetch("https://api.imgbb.com/1/upload?key=" + apiKey, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (data.status !== 200) {
      console.error("Error uploading image: ", data);
      setErrorMsg("Error uploading image. Please try again.");
      return;
    }

    return data.data.url;
  }

  async function UpdateProfileImage() {
    // upload image to api.imgbb.com by calling UploadImage function
    if (!profileImg || !profileImg.startsWith("data:image")) return;
    const imgUrl = await UploadImage(profileImg); // Add 'await' keyword to wait for the promise to resolve

    // send request to update profile image
    if (!imgUrl) {
      setErrorMsg("Error uploading image. Please try again.");
      return;
    }

    const res = await fetch("/api/auth/update/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        profileImage: imgUrl,
      }),
    });

    if (!res) {
      setErrorMsg("An error occurred. Please try again.");
    } else if (res.ok) {
      setSuccessMsg(
        "Profile image updated successfully. Redirecting to login...",
      );
      setTimeout(() => signOut({ callbackUrl: "/login" }), 3000);
    } else {
      const error = await res.json();
      setErrorMsg(error.message);
    }
  }

  return (
    <div className="mx-auto mb-auto mt-28 flex w-full max-w-screen-xl flex-col gap-8 p-8 lg:flex-row">
      <div className="flex w-full flex-col gap-8 md:flex-row lg:w-1/3 lg:flex-col">
        <ProfileSection>
          <div className="mb-4 flex justify-center">
            <Image
              src={profileImg || "/default_profile_img.png"}
              alt="Profile Picture"
              width="100"
              height="100"
              className="rounded-full"
            />
          </div>
          <h1 className="my-4 flex text-xl">
            Hello,&nbsp;
            <span className="font-semibold text-primary">{name}!</span>
          </h1>
          <div className="mb-6 flex">
            <div className="flex w-full justify-between">
              <p className="text-sm text-[#4b4b4b]">
                Tokens:{" "}
                <span className="font-semibold text-secondary">
                  {userData.tokenBalance}
                </span>
              </p>
              {isOrganization ? (
                <p className="text-sm text-[#4b4b4b]">
                  Hosted Events:{" "}
                  <span className="font-semibold text-secondary">
                    {userData.orgHostedEvents}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-[#4b4b4b]">
                  Volunteered:{" "}
                    <span className="font-semibold text-secondary">
                    {userData.volunteerHours}h
                  </span>
                </p>
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            id="profile-picture"
            onChange={(e) => {
              setErrorMsg("");
              const file = e.target.files?.[0];
              if (file) {
                console.log(file);

                // Check if file is a valid image type
                if (!["image/jpeg", "image/png"].includes(file.type)) {
                  setErrorMsg(
                    "Invalid file type. Please select a JPEG or PNG image.",
                  );
                  return;
                }

                // Check if file size is greater than 2MB
                if (!file.size || file.size > 2097152) {
                  setErrorMsg(
                    "File size is too large. Please select an image less than 2MB.",
                  );
                  return;
                }

                const reader = new FileReader();
                reader.onload = () => setProfileImg(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
          {profileImg?.startsWith("data:image") ? (
            <Button
              title="Update Profile Image"
              text="Update Image"
              onClick={UpdateProfileImage}
              full
            />
          ) : (
            <Button
              title="Change Profile Image"
              text="Change Image"
              disabled={isFetching}
              onClick={() => {
                document.getElementById("profile-picture")?.click();
              }}
              full
            />
          )}
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
            title="Send email to hello@getkindr.com"
            text="Email Us"
            onClick={() => {
              window.open("mailto:hello@getkindr.com");
            }}
            full
            outline
          />
        </ProfileSection>
      </div>
      <div className="flex w-full flex-col lg:w-2/3">
        <ProfileSection sectionHeading="Account details" editFields>
          {isFetching ? (
            <p className="animate-pulse text-[#858585] transition-all">
              Retrieving your account details...
            </p>
          ) : (
            <AccountDetailsForm />
          )}
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
