import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      organizationName,
      firstName,
      lastName,
      email,
      phone,
      password,
      isOrganization,
      userEmail, // user's current email
    } = await req.json();

    console.log("Profile update request: ", {
      firstName,
      lastName,
      organizationName,
      email,
      phone,
      password,
      isOrganization,
      userEmail,
    });
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    // Check if user exists
    if (!user) {
      console.error(
        `Profile update failed: User not found for email ${userEmail}`,
      );
      return NextResponse.json({
        status: 404,
        message: "User not found.",
      });
    }

    // if user updated their email, check if it's already in use
    if (email && email !== userEmail) {
      const emailExists = await prisma.user.findUnique({
        where: { email: email },
      });

      if (emailExists) {
        console.error(
          `Profile update failed: Email '${email}' is already associated with an account.`,
        );
        return NextResponse.json({
          status: 400,
          message: "An account with this email already exists.",
        });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        name: isOrganization ? organizationName : `${firstName} ${lastName}`,
        email: email,
        hashedPassword: password
          ? await hash(password, 16)
          : user.hashedPassword,
        phoneNumber: phone,
      },
    });

    if (!updatedUser) {
      console.error("Profile update failed: User update failed in Prisma.");
      return NextResponse.json({
        status: 500,
        message: "An unexpected error occurred. Please try again.",
      });
    }
    console.log("User updated their profile successfully.");
    return NextResponse.json({
      status: 200,
      message: "Profile updated successfully.",
    });
  } catch (e) {
    console.error("Profile update failed:", e);
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occurred. Please try again.",
    });
  }
}
