import prisma from "@/lib/prisma";

/**
 * This function will create a new one time pass in the database for a specified user.
 * @param {Request} request - The incoming request - email
 * @returns {Response} - The response to the incoming request
 * @endpoint POST /api/one-time-pass/create
 */
export async function POST(request: Request) {
  // Initialize the one time pass.
  let one_time_pass;

  try {
    // Get all the new OTP info from the request
    const { email } = await request.json();

    // If any of the required fields are missing, return an error
    if (!email) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    // Initialize a check for a unique OTP.
    let unique = false;
    // Create new OTP's until a unique one is found.
    while (!unique) {
      one_time_pass = Math.random().toString(36).slice(2, 10);
      const existingOTP = await prisma.oneTimePass.findFirst({
        where: {
          OneTimePass: one_time_pass,
        },
      });
      unique = !existingOTP;
    }

    // Create the new OTP object with the email, OTP, and expiration date based on the current time.
    const newOTP = {
      userEmail: email,
      OneTimePass: one_time_pass ?? "",
      expires: new Date(new Date().getTime() + 1 * 60 * 1000).toISOString(),
    };

    // Add the new OTP to the database
    await prisma.oneTimePass.create({
      data: newOTP,
    });
  } catch (error) {
    // If there is an error creating the OTP, return an error response.
    console.error(error);
    return new Response("Error creating OTP: " + error, {
      status: 500,
    });
  }

  // Create the response object with the new OTP and a success message.
  const response = {
    one_time_pass: one_time_pass,
    success: true,
  };

  // Return the created OTP and success message.
  return new Response(JSON.stringify(response), {
    status: 200,
  });
}
