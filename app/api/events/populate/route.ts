import prisma from "@/lib/prisma";

const dummyEvents = [
  {
    name: "Event 3",
    description: "This is the third event",
    start_time: new Date(),
    end_time: new Date(),
    organization_id: "cltyp30v10001qke0j5c80jhm",
    tags: ["tag1", "tag2", "tag3"],
    address: "123 Main St",
    city: "San Francisco",
    recurring: false,
    online: false,
    token_bounty: 100,
    number_of_spots: 10,
    event_volunteers: {
      create: [],
    },
    status: "PENDING",
  },
  {
    name: "Event 4",
    description: "This is the fourth event",
    start_time: new Date(),
    end_time: new Date(),
    organization_id: "cltyp30v10001qke0j5c80jhm",
    tags: ["tag1"],
    address: "123 Main St",
    city: "San Francisco",
    recurring: false,
    online: false,
    token_bounty: 100,
    number_of_spots: 10,
    event_volunteers: {
      create: [],
    },
    status: "PENDING",
  },
];

/**
 * Populates the database with dummy events.
 * @endpoint GET /api/events/populate
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function GET(request: Request) {
  try {
    for (const event of dummyEvents) {
      await prisma.event.create({
        data: event,
      });
    }
  } catch (error) {
    console.error(error);
    return new Response("Error adding dummy events: " + error, {
      status: 500,
    });
  }
  return new Response("Events created", { status: 200 });
}
