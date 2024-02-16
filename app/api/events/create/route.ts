import prisma from "@/lib/prisma";

/**
 * This function will create an events in the database.
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 * @endpoint POST /api/events/create
 */
export async function POST(request: Request) {
  let createdEvent;

  try {
    // Get all the new organization info from the request
    const newEvent = await request.json();

    // Set the event_volunteers to an object with a create property that is an empty array
    newEvent.event_volunteers = { create: [] };

    // Add the new event to the database
    createdEvent = await prisma.event.create({
      data: newEvent,
    });
  } catch (error) {
    console.error(error);
    return new Response("Error adding dummy events: " + error, {
      status: 500,
    });
  }

  // Return the created event
  return new Response(JSON.stringify(createdEvent), {
    status: 200,
  });
}
