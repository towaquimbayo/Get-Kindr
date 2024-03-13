import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

/**
 * Endpoint to update a users password
 * @endpoint PUT /one-time-pass/update-pass
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function PUT(request: Request) {
    try {
        const {
            email,
            password
        } = await request.json();

        if (!email) {
            return new Response("Missing user identification.", {
                status: 400,
            });
        }

        if (
            !password
        ) {
            return new Response("Updated password not received.", {
                status: 400,
            });
        }

        const hashedPassword = await hash(password, 16);
        const result = await prisma.user.update({
            where: { email: email },
            data: {
                hashedPassword: hashedPassword
            },
        });

        const response = {
            "success": true,
            "result": "Password reset successfully."
        };

        if (result) {
            return new Response(JSON.stringify(response), { status: 200 });
        } else {
            response.success = false;
            response.result = "User could not be found.";
            return new Response(JSON.stringify(response), { status: 400 });
        }

    } catch (error) {
        console.error(error);
        return new Response("Error updating password: " + error, {
            status: 500,
        });
    }
}
