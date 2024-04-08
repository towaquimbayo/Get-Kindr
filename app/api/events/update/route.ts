import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

/**
 * Endpoint to update an event by passing in the event object
 * @endpoint PUT /events/update
 * Request Params: name, description, start_time, end_time, tags, address, city, recurring, online, token_bounty, number_of_spots, coordinates
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function PUT(request: NextRequest) {
  // Get the token from the request.
  const token = await getToken({ req: request });

  // If the token is missing, return an error response.
  if (!token) {
    return new Response("No valid session found", {
      status: 401,
    });
  } else {
    // Try to get the event from the request.
    try {
      const {
        id,
        name,
        description,
        start_time,
        end_time,
        tags,
        address,
        city,
        recurring,
        online,
        token_bounty,
        number_of_spots,
        coordinates,
      } = await request.json();

      // If the eventID is missing, return an error response.
      if (!id) {
        return new Response("Missing eventID", {
          status: 400,
        });
      }

      // Get the organization ID from the token.
      const organization_id = token.organizationID
        ? (token.organizationID as string)
        : null;

      // Extract the latitude and longitude from the coordinates.
      let [latitude, longitude] = coordinates.split(",");
      latitude = Number(latitude);
      longitude = Number(longitude);
      // If any of the required fields are missing, return an error response.
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

      // Check if the users organizationID matches the organizationID of the event
      const event = await prisma.event.findUnique({
        where: { id },
      });

      // If the event organizationID does not match the users organizationID, return an error response.
      if (event?.organization_id !== organization_id) {
        throw new Error(
          "Users organizationID does not match the organizationID of the event!",
        );
      } else {
        // Update the event with the new event info passed from the request.
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
        // Return the updated event.
        return new Response(JSON.stringify(updatedEvent), { status: 200 });
      }
    } catch (error) {
      // If there is an error updating the event, return an error response.
      console.error(error);
      return new Response("Error updating event: " + error, {
        status: 500,
      });
    }
  }
}
