import prisma from "@/lib/prisma";

/**
 * This function will create a new one time pass in the database.
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 * @endpoint POST /api/one-time-pass/create
 */
export async function POST(request: Request) {
    let createdOTP;

    try {
        // Get all the new organization info from the request
        const {
            email,
            one_time_pass,
            expiration_date,
        } = await request.json();

        // If any of the required fields are missing, return an error
        if (
            !email ||
            !one_time_pass ||
            !expiration_date
        ) {
            return new Response("Missing required fields", {
                status: 400,
            });
        }

        const newOTP = {
            email,
            one_time_pass,
            expiration_date: new Date(expiration_date),
        };

        // Add the new event to the database
        createdOTP = await prisma.OneTimePass.create({
            data: newOTP,
        });
    } catch (error) {
        console.error(error);
        return new Response("Error creating OTP: " + error, {
            status: 500,
        });
    }

    // Return the created event
    return new Response(JSON.stringify("OTP created successfully."), {
        status: 200,
    });
}
