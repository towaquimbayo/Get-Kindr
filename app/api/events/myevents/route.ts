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

function getOrganizationEvents(organizationID: string) {
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

function getVolunteerEvents(volunteerID: string) {
  return prisma.event.findMany({
    where: {
      event_volunteers: {
        some: {
          id: volunteerID,
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
