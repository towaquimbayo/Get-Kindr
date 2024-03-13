import prisma from "@/lib/prisma";

/**
 * Endpoint for finding if an email matches with OTP: GET /api/one-time-pass/verify
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function GET(request: Request) {
    try {
        const email = request.url.split("=")?.[1];
        const decodedEmail = decodeURIComponent(email);
        // If any of the required fields are missing, return an error
        if (
            !decodedEmail
        ) {
            return new Response("Missing required fields", {
                status: 400,
            });
        }
        // get the OTP from the database
        const result = await prisma.OneTimePass.findFirst({
            where: { userEmail: decodedEmail }
        });

        if (result) {
            const response = {
                "success": true,
                "one_time_pass": result.OneTimePass,
            };
            return new Response(JSON.stringify(response), { status: 200 });
        } else {
            return new Response("Invalid One Time Pass", { status: 400 });
        }

    } catch (error) {
        console.error(error);
        return new Response("Error checking One TimePass: " + error, {
            status: 500,
        });
    }
}
