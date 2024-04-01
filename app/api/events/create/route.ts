import prisma from "@/lib/prisma";
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

/**
 * This function will create an events in the database.
 * @param {Request} request - The incoming request
 * Request Params: name, description, start_time, end_time, tags, address, city, recurring, online, token_bounty, number_of_spots, coordinates
 * @returns {Response} - The response to the incoming request
 * @endpoint POST /api/events/create
 */
export async function POST(request: NextRequest) {
  // Get the token from the request.
  const token = await getToken({ req: request });

  // If the token is missing, return an error response.
  if (!token) {
    return new Response("No valid session found", {
      status: 401,
    });
  }else if (token.accountType == "ORGANIZATION") {
    // If the account is an organization, create the event.
    let createdEvent;

    // Try to create the event.
    try {
      // Get all the new organization info from the request.
      const {
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
      // Get the organization ID from the token.
      const organization_id = token.organizationID ? token.organizationID as string : null;
  
    // Extract the latitude and longitude from the coordinates.
    const [latitude, longitude] = coordinates;

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
  
      // Create a new event object with the new event info passed from the request.
      const newEvent = {
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
        latitude,
        longitude,
        status: "UPCOMING", // Default initial status
        event_volunteers: { create: [] }, // Add an empty array for event_volunteers
      };
  
      // Add the new event to the database
      createdEvent = await prisma.event.create({
        data: newEvent,
      });
    } catch (error) {
      // If there is an error creating the event, return an error response.
      console.log("error" + error);
      return new Response("Error adding events: " + error, {
        status: 500,
      });
    }
  
    // Return the created event,
    return new Response(JSON.stringify(createdEvent), {
      status: 200,
    });
  } else {
    // If the account is not an organization, return an error response.
    return new Response("Account is not an organization!", {
      status: 401,
    });
  }
}
