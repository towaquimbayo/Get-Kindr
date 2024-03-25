import prisma from "@/lib/prisma";
import { getToken } from 'next-auth/jwt';
import { NextRequest } from "next/server";

/**
 * Endpoint to update an event by passing in the event object
 * @endpoint PUT /events/update
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function PUT(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return new Response("No valid session found", {
      status: 401,
    });
  } else {
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
      } = await request.json();
  
      if (!id) {
        return new Response("Missing eventID", {
          status: 400,
        });
      }
      
      const organization_id = token.organizationID ? token.organizationID as string : null;
  
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
      
      // Check if the users organizationID matches the organizationID of the event
      const event = await prisma.event.findUnique({
        where: { id },
      });

      if (event?.organization_id !== organization_id) {
        throw new Error("Users organizationID does not match the organizationID of the event!");
      } else {
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
          },
        });
        return new Response(JSON.stringify(updatedEvent), { status: 200 });
      }
    } catch (error) {
      console.error(error);
      return new Response("Error updating event: " + error, {
        status: 500,
      });
    }
  }
}
