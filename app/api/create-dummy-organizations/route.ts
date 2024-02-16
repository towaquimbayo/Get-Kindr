import prisma from "@/lib/prisma";

/*
 * This function will create dummy organizations in the database.
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
const dummyOrganizations = [
  {
    userId: "clsbaedkb0000kz08ed2mi46o",
    name: "Organization 1",
    description: "This is the first organization",
    events: {
      create: [],
    },
  },
];

export async function GET(request: Request) {
  try {
    for (const organization of dummyOrganizations) {
      await prisma.organization.create({
        data: organization,
      });
    }
  } catch (error) {
    console.error(error);
    return new Response("Error adding dummy organizations: " + error, {
      status: 500,
    });
  }
  return new Response("organizations created", { status: 200 });
}
