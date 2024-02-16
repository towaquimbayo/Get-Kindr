import prisma from "@/lib/prisma";

/**
 * Endpoint for getting all events: GET /api/events
 * Param: organization_id - The organization id (optional)
 * @param {Request} request - The incoming request
 */
export async function GET(request: Request) {
  try {
    const organizationId = request.url.split("=")?.[1];
    // If organization_id is present, get events for that organization
    // Otherwise, get all events
    const events = organizationId
      ? await prisma.event.findMany({
          where: { organization_id: organizationId },
        })
      : await prisma.event.findMany();

    return new Response(JSON.stringify(events), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error getting events: " + error, {
      status: 500,
    });
  }
}
