import prisma from "@/lib/prisma";

/**
 * Endpoint for getting all attendees for an event: GET /api/events/attendees?event_id=
 * Param: event_id - The event id
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 * @endpoint GET /api/events/attendees
 *
 */
export async function GET(request: Request) {
  try {
    // Get the event_id from the request URL.
    const eventId = request.url.split("=")?.[1];
    // If event_id is not present, throw an error response.
    if (!eventId) {
      return new Response("Missing required field: eventId", {
        status: 400,
      });
    }

    // Get all the attendees including their volunteer info and user info.
    const attendees = await prisma.eventVolunteer.findMany({
      where: { eventId },
      include: {
        volunteer: {
          include: {
            user: true,
          },
        },
      },
    });

    // Return the attendees.
    return new Response(JSON.stringify(attendees), { status: 200 });
  } catch (error) {
    // If there is an error getting the attendees, return an error response.
    console.error(error);
    return new Response("Error getting attendees: " + error, {
      status: 500,
    });
  }
}

/**
 * Endpoint for adding an attendee to an event: POST /api/events/attendees
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 * @endpoint POST /api/events/attendees
 *
 * Example request body:
 * {
 *  "volunteerId": "1",
 *  "eventId": "1"
 * }
 */
export async function POST(request: Request) {
  try {
    // Get the volunteerId and eventId from the request body.
    const { volunteerId, eventId } = await request.json();

    // If any of the required fields are missing, return an error response.
    if (!volunteerId || !eventId) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    // If the volunteer and event pair already exists, return an error response.
    const existingAttendee = await prisma.eventVolunteer.findFirst({
      where: { volunteerId, eventId },
    });

    // If the volunteer is already attending the event, return an error response.
    if (existingAttendee) {
      return new Response(
        `Already attending event: volunteerId: ${volunteerId}, eventId: ${eventId}`,
        { status: 400 },
      );
    }

    // Add the new attendee to the database.
    const newAttendee = await prisma.eventVolunteer.create({
      data: {
        volunteerId,
        eventId,
      },
    });

    // Return the new attendee.
    return new Response(JSON.stringify(newAttendee), { status: 200 });
  } catch (error) {
    // If there is an error adding the attendee, return an error response.
    console.error(error);
    return new Response("Error adding attendee: " + error, {
      status: 500,
    });
  }
}
