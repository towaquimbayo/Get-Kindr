import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

/**
 * Endpoint to update a users password
 * @endpoint PUT /one-time-pass/update-pass
 * @param {Request} request - The incoming request - email, password
 * @returns {Response} - The response to the incoming request
 */
export async function PUT(request: Request) {
    try {
        
        // Get the email and password from the request.
        const {
            email,
            password
        } = await request.json();

        // If the email is missing, return an error.
        if (!email) {
            return new Response("Missing user identification.", {
                status: 400,
            });
        }

        // If the password is missing, return an error.
        if (!password) {
            return new Response("Updated password not received.", {
                status: 400,
            });
        }

        // Hash the new password and update the user in the database based on the passed email.
        const hashedPassword = await hash(password, 16);
        const result = await prisma.user.update({
            where: { email: email },
            data: {
                hashedPassword: hashedPassword
            },
        });

        // Define a success response.
        const response = {
            "success": true,
            "result": "Password reset successfully."
        };

        // If the user is found and the password is updated, return a success response.
        if (result) {
            return new Response(JSON.stringify(response), { status: 200 });
        } else {
            // If the user is not found, return an error and an updated response.
            response.success = false;
            response.result = "User could not be found.";
            return new Response(JSON.stringify(response), { status: 400 });
        }

    } catch (error) {
        // If there is an error updating the password, return an error.
        console.error(error);
        return new Response("Error updating password: " + error, {
            status: 500,
        });
    }
}
