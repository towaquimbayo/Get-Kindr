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
        // Get all the new OTP info from the request
        const {
            email,
            expiration_date,
        } = await request.json();

        // If any of the required fields are missing, return an error
        if (
            !email ||
            !expiration_date
        ) {
            return new Response("Missing required fields", {
                status: 400,
            });
        }
        
        let unique = false;
        let one_time_pass;

        while (!unique) {
            one_time_pass = Math.random().toString(36).slice(2, 10);
            const existingOTP = await prisma.OneTimePass.findFirst({
                where: {
                    one_time_pass,
                },
            });
            unique = !existingOTP;
        }

        const newOTP = {
            email,
            one_time_pass,
            expiration_date: new Date(expiration_date),
        };

        // Add the new OTP to the database
        createdOTP = await prisma.OneTimePass.create({
            data: newOTP,
        });

    } catch (error) {
        console.error(error);
        return new Response("Error creating OTP: " + error, {
            status: 500,
        });
    }

    const response = {
        "one_time_pass": createdOTP,
        "message": "OTP created successfully.",
    };

    // Return the created OTP
    return new Response(JSON.stringify(response), {
        status: 200,
    });
}
