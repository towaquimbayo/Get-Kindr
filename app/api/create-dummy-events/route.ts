import prisma from "@/lib/prisma";

/*
 * This function will create dummy events in the database.
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
const dummyEvents = [
  {
    name: "Event 1",
    description: "This is the first event",
    start_time: new Date(),
    end_time: new Date(),
    // Generate random UUID
    organization_id: "923e4567-e89b-12d3-a456-426614174000",
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
  },
  {
    name: "Event 2",
    description: "This is the second event",
    start_time: new Date(),
    end_time: new Date(),
    organization_id: "923e4567-e89b-12d3-a456-426614174000",
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
  },
];

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
