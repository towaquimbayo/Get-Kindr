import prisma from "@/lib/prisma";

/**
 * Endpoint for finding all accounts with matching emails: GET /api/emails?email=
 * Param: email - The email to check against
 * @param {Request} request - The incoming request
 */
export async function GET(request: Request) {
    try {

        // Get the email from the request.
        const email = request.url.split("=")?.[1];
        const decodedEmail = decodeURIComponent(email);

        // Find the user with the matching email.
        const result = await prisma.user.findFirst({
            where: { email: decodedEmail }
        })

        if (result) {
            // If the user exists, return true.
            return new Response(JSON.stringify(true), { status: 200 });
        } else {
            // If the user does not exist, return false.
            return new Response(JSON.stringify(false), { status: 200 });
        }

    } catch (error) {
        // If an error occurs return an error response.
        console.error(error);
        return new Response("Error searching for user emails: " + error, {
            status: 500,
        });
    }
}
