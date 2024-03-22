import prisma from "@/lib/prisma";

/**
 * Endpoint to update an event by passing in the event object
 * @endpoint PUT /events/update
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function PUT(request: Request) {
  try {
    const {
      id,
      name,
      description,
      start_time,
      end_time,
      organization_id,
      tags,
      address,
      city,
      recurring,
      online,
      token_bounty,
      number_of_spots,
      coordinates
    } = await request.json();

    if (!id) {
      return new Response("Missing id", {
        status: 400,
      });
    }

    const [latitude, longitude] = coordinates;

    if (
      !name ||
      !start_time ||
      !end_time ||
      !organization_id ||
      !address ||
      !city ||
      !token_bounty ||
      !number_of_spots ||
      !latitude ||
      !longitude
    ) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        name,
        description,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        organization_id,
        tags,
        address,
        city,
        recurring,
        online,
        token_bounty,
        number_of_spots,
        latitude,
        longitude,
      },
    });
    return new Response(JSON.stringify(updatedEvent), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error updating event: " + error, {
      status: 500,
    });
  }
}
