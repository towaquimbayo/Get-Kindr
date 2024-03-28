import prisma from "@/lib/prisma";
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

/**
 * Endpoint for getting user specific events: POST /api/events/myevents
 * 
 * request parameters are taken from the JWT.
 * Nothing should be passed in the body for security,
 * as the JWT will verify the user and contain the necessary information.
 *
 * @param {NextRequest} request - The incoming request
 */
export async function POST(req: NextRequest) {
  const token = await getToken({ req });

  if (token) {
    const volunteerID = token.volunteerID;
    const organizationID = token.organizationID;

    if (!volunteerID && !organizationID) {
      return new Response("Missing ID!", {
        status: 401,
      });
    } else {
      try {
        let events;

        if (volunteerID) {
          events = await getVolunteerEvents(volunteerID as string);
        } else {
          events = await getOrganizationEvents(organizationID as string);
        }
        // console.log("Events:", events);

        return new Response(JSON.stringify(events), { status: 200 });
      } catch (error) {
        console.error(error);
        return new Response("Server error getting events!", {
          status: 500,
        });
      }
    }
  } else {
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
  return prisma.event.findMany({
    where: {
      organization_id: organizationID,
    },
    orderBy: {
      end_time: "asc",
    },
    include: {
      event_volunteers: true,
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
