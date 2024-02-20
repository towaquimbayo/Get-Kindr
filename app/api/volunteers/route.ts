import prisma from "@/lib/prisma";

/**
 * Endpoint for getting all volunteers: GET /api/volunteers
 * Param: volunteer_id - The volunteer id (optional)
 * @param {Request} request - The incoming request
 */
export async function GET(request: Request) {
  try {
    const volunteerId = request.url.split("=")?.[1];
    // If volunteer_id is present, get info for that volunteer
    // Otherwise, get all volunteers
    const volunteers = volunteerId
      ? await prisma.volunteer.findFirst({
          where: { id: volunteerId },
        })
      : await prisma.volunteer.findMany();

    return new Response(JSON.stringify(volunteers), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error getting volunteers: " + error, {
      status: 500,
    });
  }
}
