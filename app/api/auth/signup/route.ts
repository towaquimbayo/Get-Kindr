import { NextResponse } from "next/server";
import { hash } from "bcrypt";

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

    // TODO: Check if email already exists
    // TODO: Save user to database
    // TODO: Send verification email
    console.log("Signup Data: ", {
      first_name,
      last_name,
      email,
      is_organization,
      organization_name,
    });

    const hashedPassword = await hash(password, 16);

    return NextResponse.json({ message: "Signup successful" }, { status: 200 });
  } catch (e) {
    console.error("Signup failed", e);
    return NextResponse.error();
  }
}
