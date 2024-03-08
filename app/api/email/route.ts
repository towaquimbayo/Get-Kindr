import prisma from "@/lib/prisma";

/**
 * Endpoint for finding all accounts with matching emails: GET /api/users/emails
 * Param: email - The email to check against
 * @param {Request} request - The incoming request
 */
export async function GET(request: Request) {
    try {
        
        // get the data from the request ?email=...
        const email = request.url.split("=")?.[1];

        const result = await prisma.user.findFirst({
            where: { email: email }
        })

        if (result) {
            return new Response(JSON.stringify(true), { status: 200 });
        } else {
            return new Response("No matching emails found", { status: 404 });
        }

    } catch (error) {
        console.error(error);
        return new Response("Error searching for user emails: " + error, {
            status: 500,
        });
    }
}
