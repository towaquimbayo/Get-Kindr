import prisma from "@/lib/prisma";

/**
 * Endpoint for getting all organizations: GET /api/organizations/find-by-user
 * Param: organization_id - The organization id
 * @param {Request} request - The incoming request
 */
export async function GET(request: Request) {
  try {
    const userID = request.url.split("=")?.[1];
    const organizations = userID
      ? await prisma.organization.findFirst({
        where: { userId: userID },
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
