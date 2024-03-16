import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userEmail = decodeURIComponent(url.searchParams.get("email") || "");
    console.log("Fetching user for email: ", userEmail);

    if (!userEmail) {
      console.error("Email was not provided in the request.");
      return NextResponse.json(
        { message: "Email cannot be empty." },
        { status: 404 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      console.error("User not found for email: ", userEmail);
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const isOrganization = user.accountType?.toLowerCase() === "organization";

    // find phone number based on account type
    let phone = "";
    if (isOrganization) {
      const organization = await prisma.organization.findUnique({
        where: { userId: user.id },
      });
      if (organization) phone = organization.phoneNumber || "";
    } else {
      const volunteer = await prisma.volunteer.findUnique({
        where: { userId: user.id },
      });
      if (volunteer) phone = volunteer.phoneNumber || "";
    }

    console.log("Successfully fetched user: ", user);
    return NextResponse.json({
      status: 200,
      user: {
        firstName: isOrganization ? "" : user.name?.split(" ")[0],
        lastName: isOrganization ? "" : user.name?.split(" ")[1],
        organizationName: isOrganization ? user.name : "",
        email: user.email,
        phone: phone,
        isOrganization: isOrganization,
        password: "",
      },
    });
  } catch (e) {
    console.error("Fetching user failed:", e);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
