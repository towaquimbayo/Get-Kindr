import prisma from "@/lib/prisma";
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

/**
 * This function will create an events in the database.
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 * @endpoint POST /api/events/create
 */
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return new Response("No valid session found", {
      status: 401,
    });
  }else if (token.accountType == "ORGANIZATION") {
    let createdEvent;

    try {
      // Get all the new organization info from the request
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
      } = await request.json();

      const organization_id = token.organizationID ? token.organizationID as string : null;
  
      // If any of the required fields are missing, return an error
      if (
        !name ||
        !start_time ||
        !end_time ||
        !organization_id ||
        !address ||
        !city ||
        !token_bounty ||
        !number_of_spots
      ) {
        return new Response("Missing required fields", {
          status: 400,
        });
      }
  
      // Create a new event object with the new event info
      const newEvent = {
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
        status: "UPCOMING", // Default initial status
        event_volunteers: { create: [] }, // Add an empty array for event_volunteers
      };
  
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
  } else {
    return new Response("Account is not an organization!", {
      status: 401,
    });
  }
}
