import prisma from "@/lib/prisma";

/**
 * Endpoint to delete an event by id
 * @endpoint DELETE /api/one-time-pass/delete
 * @param {Request} request - The incoming request - OneTimePass
 * @returns {Response} - The response to the incoming request
 */
export async function DELETE(request: Request) {
  try {
    // Get the OTP from the request.
    const otp = await request.json();
    const OTP = otp.OneTimePass;
    // If the OTP is missing, return an error.
    if (!OTP) {
      return new Response("Missing OTP", {
        status: 400,
      });
    }
    // Delete the OTP from the database.
    await prisma.oneTimePass.delete({
      where: { OneTimePass: OTP },
    });
    // Return a success message.
    return new Response("OTP deleted", { status: 200 });
  } catch (error) {
    // If there is an error deleting the OTP, return an error.
    console.error(error);
    return new Response("Error deleting OTP: " + error, {
      status: 500,
    });
  }
}
