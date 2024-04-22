import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";
import { AccountType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const {
      firstName,
      lastName,
      organizationName,
      email,
      password,
      isOrganization,
    } = await req.json();

    console.log("Signup request: ", {
      firstName,
      lastName,
      organizationName,
      email,
      password,
      isOrganization,
    });

    // Check if required fields are present
    if (
      (isOrganization && !organizationName) ||
      (!isOrganization && (!firstName || !lastName)) ||
      !email ||
      !password
    ) {
      console.error("Signup failed: Missing required fields.");
      return NextResponse.json(
        { message: "Please fill out all mandatory fields." },
        { status: 400 },
      );
    }

    // Check if user already exists
    const emailExist = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExist) {
      console.error(
        `Signup failed: Email ${email} is already associated with an account.`,
      );
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 16);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: isOrganization ? organizationName : `${firstName} ${lastName}`,
        email,
        hashedPassword,
        image: `https://ui-avatars.com/api/?name=${
          isOrganization
            ? organizationName.replace(" ", "+")
            : (firstName + lastName).replace(" ", "+")
        }`,
        accountType: isOrganization
          ? AccountType.ORGANIZATION
          : AccountType.VOLUNTEER,
        accounts: {},
        organization: isOrganization
          ? {
              create: {
                name: organizationName,
                description: "",
                events: {},
              },
            }
          : {},
        volunteer: isOrganization ? {} : {
          create: {
            bio: "This is my bio",
          },
        },
        admin: false,
        tokenBalance: isOrganization ? 10000 : 0,
      },
    });

    if (!user) {
      console.error("Signup failed: User creation failed in Prisma.");
      return NextResponse.json(
        { message: "An unexpected error occurred. Please try again." },
        { status: 500 },
      );
    }
    console.log(`User ${email} signed up successfully.`);
    return NextResponse.json(user);
  } catch (e) {
    console.error("Signup failed:", e);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
