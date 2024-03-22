import prisma from "@/lib/prisma";

/**
 * Endpoint for getting all organizations: GET /api/organizations/find-by-id
 * Param: organization_id - The organization id (optional)
 * @param {Request} request - The incoming request
 */
export async function GET(request: Request) {
  try {
    const organizationId = request.url.split("=")?.[1];
    // If organization_id is present, get info for that organization
    // Otherwise, get all organizations
    const organizations = organizationId
      ? await prisma.organization.findFirst({
          where: { id: organizationId },
          include: {
            user: true,
          },
        })
      : await prisma.organization.findMany({ include: { user: true } });

    return new Response(JSON.stringify(organizations), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error getting organizations: " + error, {
      status: 500,
    });
  }
}
