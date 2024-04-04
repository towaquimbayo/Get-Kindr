import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { profileImage, email } = await req.json();

    console.log("Profile image update request: ", {
      profileImage,
      email,
    });
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // Check if user exists
    if (!user) {
      console.error(
        `Profile image update failed: User not found for email ${email}`,
      );
      return NextResponse.json({
        status: 404,
        message: "User not found.",
      });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { image: profileImage },
    });

    if (!updatedUser) {
      console.error("Profile image update failed: User update failed in Prisma.");
      return NextResponse.json({
        status: 500,
        message: "An unexpected error occurred. Please try again.",
      });
    }
    console.log("User updated their profile successfully.");
    return NextResponse.json({
      status: 200,
      message: "Profile image updated successfully.",
    });
  } catch (e) {
    console.error("Profile image update failed:", e);
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occurred. Please try again.",
    });
  }
}
