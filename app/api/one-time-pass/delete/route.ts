import prisma from "@/lib/prisma";

/**
 * Endpoint to delete an event by id
 * @endpoint DELETE /api/one-time-pass/delete
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function DELETE(request: Request) {
  try {
    const otp = await request.json();
    const OTP = otp.OneTimePass;
    if (!OTP) {
      return new Response("Missing OTP", {
        status: 400,
      });
    }
    await prisma.oneTimePass.delete({
      where: { OneTimePass: OTP },
    });
    return new Response("OTP deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error deleting OTP: " + error, {
      status: 500,
    });
  }
}
