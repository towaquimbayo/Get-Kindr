import prisma from "@/lib/prisma";

/**
 * Endpoint for finding if an email matches with OTP: GET /api/one-time-pass/verify?otp=
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function GET(request: Request) {
  try {
    // Split the URL to look for the one time pass.
    const one_time_pass = request.url.split("=")?.[1];
    // If the OTP is missing, return an error
    if (!one_time_pass) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    // Look for the OTP in the database
    const result = await prisma.oneTimePass.findFirst({
      where: { OneTimePass: one_time_pass },
    });

    // Check that the current date is before the expiration date and return 'expired' if it is.
    if (result && result?.expires < new Date()) {
      return new Response("One Time Pass has expired", { status: 400 });
    }

    // If the OTP is found, get the email associated with it.
    let OTP_email = result?.userEmail;
    let returnDict = {
      email: OTP_email,
      success: true,
    };
    // If an email is found, return the email and a success message.
    if (result) {
      return new Response(JSON.stringify(returnDict), { status: 200 });
    } else {
      // If the OTP is not found, return an error.
      returnDict.success = false;
      return new Response(JSON.stringify(returnDict), { status: 400 });
    }
  } catch (error) {
    // If there is an error checking the OTP, return an error.
    console.error(error);
    return new Response("Error checking OneTimePass: " + error, {
      status: 500,
    });
  }
}
