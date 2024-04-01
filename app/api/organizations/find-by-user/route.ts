import prisma from "@/lib/prisma";

/**
 * Endpoint for getting all organizations: GET /api/organizations/find-by-user?organization_id=
 * Param: organization_id - The organization id
 * @param {Request} request - The incoming request
 */
export async function GET(request: Request) {
  try {
    // Get the organization_id from the request.
    const userID = request.url.split("=")?.[1];
    // If organization_id is present, get info for that organization
    const organizations = userID
      ? await prisma.organization.findFirst({
        where: { userId: userID },
          include: {
            user: true,
          },
        })
      : await prisma.organization.findMany({ include: { user: true } });
    // Return the organizations found.
    return new Response(JSON.stringify(organizations), { status: 200 });
  } catch (error) {
    // If an error occurs return an error response.
    console.error(error);
    return new Response("Error getting organizations: " + error, {
      status: 500,
    });
  }
}
