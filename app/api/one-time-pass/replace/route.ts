import prisma from "@/lib/prisma";

/**
 * Endpoint for finding if an email matches with OTP: GET /api/one-time-pass/verify?email=
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function GET(request: Request) {
  try {
    // Split the URL to look for the email.
    const email = request.url.split("=")?.[1];
    // Decode the email from the URL.
    const decodedEmail = decodeURIComponent(email);
    
    // If any of the required fields are missing, return an error
    if (!decodedEmail) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    // Look for an OTP in the database with a matching email.
    const result = await prisma.oneTimePass.findFirst({
      where: { userEmail: decodedEmail },
    });

    // If the OTP is found, get the OTP associated with it.
    if (result) {
      const response = {
        success: true,
        one_time_pass: result.OneTimePass,
      };
      // Return the OTP and a success message.
      return new Response(JSON.stringify(response), { status: 200 });
    } else {
      // If the OTP is not found, return an error.
      return new Response("Invalid One Time Pass", { status: 400 });
    }
  } catch (error) {
    // If there is an error checking the OTP, return an error.
    console.error(error);
    return new Response("Error checking One TimePass: " + error, {
      status: 500,
    });
  }
}
