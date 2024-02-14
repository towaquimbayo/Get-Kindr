import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";
import { AccountType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      is_organization,
      organization_name,
    } = await req.json();

    // Check if user already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 16);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: first_name + " " + last_name,
        email,
        hashedPassword,
        image:
          "https://ui-avatars.com/api/?name=" + first_name + "+" + last_name,
        accountType: is_organization
          ? AccountType.ORGANIZATION
          : AccountType.VOLUNTEER,
        accounts: {},
        organization: is_organization
          ? {
              create: {
                name: organization_name,
                description: "",
                events: {},
              },
            }
          : {},
        volunteer: is_organization
          ? {}
          : {
              create: {
                bio: "This is my bio",
                phoneNumber: "123-456-7890",
                admin: false,
              },
            },
      },
    });

    console.log("User created: ", user);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error("Signup failed", e);
    return new Response("Failed to signup", { status: 500 });
  }
}
