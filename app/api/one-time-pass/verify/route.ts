import prisma from "@/lib/prisma";

/**
 * Endpoint for finding if an email matches with OTP: GET /api/one-time-pass/verify
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function GET(request: Request) {
    try {
        const one_time_pass = request.url.split("=")?.[1];
        // If any of the required fields are missing, return an error
        if (
            !one_time_pass
        ) {
            return new Response("Missing required fields", {
                status: 400,
            });
        }

        const result = await prisma.OneTimePass.findFirst({
            where: { OneTimePass: one_time_pass}
        });

        // Check that the current date is before the expiration date
        if (result && result?.expiration_date < new Date()) {
            return new Response("One Time Pass has expired", { status: 404 });
        }

        if (result) {
            return new Response(JSON.stringify(true), { status: 200 });
        } else {
            return new Response("Invalid One Time Pass", { status: 404 });
        }

    } catch (error) {
        console.error(error);
        return new Response("Error checking OneTimePass: " + error, {
            status: 500,
        });
    }
}
