import prisma from "@/lib/prisma";

/**
 * Endpoint for getting all attendees for an event: GET /api/events/attendees
 * Param: event_id - The event id (optional)
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 * @endpoint GET /api/events/attendees
 *
 * Example request: /api/events/attendees?event_id=1
 */
export async function GET(request: Request) {
  try {
    const eventId = request.url.split("=")?.[1];
    // If event_id is present, get attendees for that event
    // Otherwise, throw an error
    if (!eventId) {
      return new Response("Missing required field: eventId", {
        status: 400,
      });
    }

    // Get all the attendees including their volunteer info and user info
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

    return new Response(JSON.stringify(attendees), { status: 200 });
  } catch (error) {
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
    const { volunteerId, eventId } = await request.json();

    if (!volunteerId || !eventId) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    // If the volunteer and event pair already exists, return an error
    const existingAttendee = await prisma.eventVolunteer.findFirst({
      where: { volunteerId, eventId },
    });

    if (existingAttendee) {
      return new Response(
        `Already attending event: volunteerId: ${volunteerId}, eventId: ${eventId}`,
        { status: 400 },
      );
    }

    const newAttendee = await prisma.eventVolunteer.create({
      data: {
        volunteerId,
        eventId,
      },
    });

    return new Response(JSON.stringify(newAttendee), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error adding attendee: " + error, {
      status: 500,
    });
  }
}
