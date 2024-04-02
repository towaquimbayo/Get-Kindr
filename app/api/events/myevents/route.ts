import prisma from "@/lib/prisma";
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

/**
 * Endpoint for getting user specific events: GET /api/events/myevents
 * 
 * request parameters are taken from the JWT.
 * Nothing should be passed in the body for security,
 * as the JWT will verify the user and contain the necessary information.
 *
 * @param {NextRequest} request - The incoming request
 */
export async function GET(req: NextRequest) {
  // Get the token from the request.
  const token = await getToken({ req });

  // If the token is missing, return an error response.
  if (token) {
    // Get the volunteerID and organizationID from the token.
    const volunteerID = token.volunteerID;
    const organizationID = token.organizationID;

    // If both IDs are missing, return an error response.
    if (!volunteerID && !organizationID) {
      return new Response("Missing ID!", {
        status: 401,
      });
    } else {
      try {
        // Initialize the events variable.
        let events;

        // If the volunteerID is present, get the volunteer's events.
        if (volunteerID) {
          events = await getVolunteerEvents(volunteerID as string);
        } else {
          // Otherwise, if the organizationID is present, get the organization's events.
          events = await getOrganizationEvents(organizationID as string);
        }
        console.log("Events:", events);

        // Return the events.
        return new Response(JSON.stringify(events), { status: 200 });
      } catch (error) {
        // If there is an error getting the events, return an error response.
        console.error(error);
        return new Response("Server error getting events!", {
          status: 500,
        });
      }
    }
  } else {
    // If the token is missing, return an error response.
    return new Response("Missing Token!", {
      status: 401,
    });
  }
}

/**
 * Gets all events for a given organization including their registered volunteers for the events
 * 
 * @param organizationID The organization ID to get events for
 * @returns All events for the organization and their volunteers
 */
function getOrganizationEvents(organizationID: string) {
  // console.log("Getting events for organization:", organizationID);

  // Get all events for the organization and include the event volunteers.
  // Order the events by end time in ascending order.
  return prisma.event.findMany({
    where: {
      organization_id: organizationID,
    },
    orderBy: {
      end_time: "asc",
    },
    include: {
      event_volunteers: true,
      organization: {
        select: {
          name: true,
        },
      },
    },
  });
}

/**
 * Get all events for a given volunteer
 * 
 * @param volunteerID The volunteer ID to get events for
 * @returns All registered events for the volunteer
 */
function getVolunteerEvents(volunteerID: string) {
  // console.log("Getting events for volunteer:", volunteerID);

  // Get all events for the volunteer where the volunteer is registered.
  // Order the events by end time in ascending order.
  return prisma.event.findMany({
    where: {
      event_volunteers: {
        some: {
          volunteerId: volunteerID,
        },
      },
    },
    orderBy: {
      end_time: "asc",
    },
    include: {
      organization: {
        select: {
          name: true,
        },
      },
    },
  });
}
