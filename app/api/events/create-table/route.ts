import prisma from "@/lib/prisma";

/**
 * This function will create a table in the database if it does not exist.
 * @endpoint GET /api/events/create-table
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function GET(request: Request) {
  try {
    // Try to create the events table if it does not exist.
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS public."Event" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        organization_id UUID NOT NULL,
        tags TEXT[],
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        recurring BOOLEAN NOT NULL,
        online BOOLEAN NOT NULL,
        token_bounty INT NOT NULL,
        number_of_spots INT NOT NULL,
        event_volunteers UUID[]
        -- organizationId UUID REFERENCES Organization(id) Todo: MISSING - Add later
      )`;
  } catch (error) {
    // If there is an error creating the table, return an error response.
    return new Response("Error creating events table: " + error, {
      status: 500,
    });
  }
  // Return a success message.
  return new Response("Events table created", { status: 200 });
}
