import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";
import { AccountType } from "@prisma/client";
import jwt from "jsonwebtoken";

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

    console.log("POST request: ", {
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
      console.error("Missing required fields");
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const emailExist = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExist) {
      console.error("Email already exists");
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 16);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        hashedPassword,
        image: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
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
        volunteer: isOrganization
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

    if (!user) {
      console.error("User creation failed");
      return NextResponse.json(
        { message: "User creation failed" },
        { status: 500 },
      );
    }
    console.log("User created: ", user);

    const token = await jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      },
    );
    const response = NextResponse.json({ message: "Signup successful", success: true });
    response.cookies.set("token", token, { httpOnly: true, path: "/" });
    return response;
    // return NextResponse.json(user);
  } catch (e) {
    console.error("Signup failed", e);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}
