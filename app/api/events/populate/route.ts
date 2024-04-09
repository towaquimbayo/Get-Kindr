import prisma from "@/lib/prisma";
import { Event } from "@prisma/client";

// Define a list of dummy events to populate the database.
const dummyEvents: Event[] = [
//   {
//     name: "Community Cleanup Day",
//     description: "Join us for a day of cleaning up our neighborhood!",
//     start_time: new Date("2024-04-15T09:00:00Z"),
//     end_time: new Date("2024-04-15T12:00:00Z"),
//     organization_id: "cltyp30v10001qke0j5c80jhm",
//     tags: ["community", "environment", "volunteering"],
//     address: "456 Elm St",
//     city: "Los Angeles",
//     recurring: false,
//     online: false,
//     token_bounty: 50,
//     number_of_spots: 20,
//     event_volunteers: {
//       create: [],
//     },
//     status: "UPCOMING",
//     latitude: 34.0522,
//     longitude: -118.2437,
//   },
//   {
//     name: "Tech Workshop: Introduction to Coding",
//     description: "Learn the basics of coding in this hands-on workshop!",
//     start_time: new Date("2024-05-10T14:00:00Z"),
//     end_time: new Date("2024-05-10T16:00:00Z"),
//     organization_id: "cltyp30v10001qke0j5c80jhm",
//     tags: ["technology", "education", "workshop"],
//     address: "789 Oak St",
//     city: "New York",
//     recurring: false,
//     online: false,
//     token_bounty: 0,
//     number_of_spots: 15,
//     event_volunteers: {
//       create: [],
//     },
//     status: "UPCOMING",
//     latitude: 40.7128,
//     longitude: -74.006,
//   },
//   {
//     name: "Food Drive",
//     description: "Help us collect food donations for those in need!",
//     start_time: new Date("2024-06-20T10:00:00Z"),
//     end_time: new Date("2024-06-20T14:00:00Z"),
//     organization_id: "cltyp30v10001qke0j5c80jhm",
//     tags: ["community", "charity", "volunteering"],
//     address: "321 Pine St",
//     city: "Chicago",
//     recurring: false,
//     online: false,
//     token_bounty: 30,
//     number_of_spots: 25,
//     event_volunteers: {
//       create: [],
//     },
//     status: "UPCOMING",
//     latitude: 41.8781,
//     longitude: -87.6298,
//   },
//   {
//     name: "Nature Trail Cleanup",
//     description: "Join us in maintaining our local nature trail!",
//     start_time: new Date("2024-07-05T08:00:00Z"),
//     end_time: new Date("2024-07-05T12:00:00Z"),
//     organization_id: "cltyp30v10001qke0j5c80jhm",
//     tags: ["environment", "outdoors", "volunteering"],
//     address: "234 Maple Ave",
//     city: "Seattle",
//     recurring: false,
//     online: false,
//     token_bounty: 40,
//     number_of_spots: 15,
//     event_volunteers: {
//       create: [],
//     },
//     status: "UPCOMING",
//     latitude: 47.6062,
//     longitude: -122.3321,
//   },
//   {
//     name: "Senior Center Visit",
//     description: "Spend time with the elderly at our local senior center!",
//     start_time: new Date("2024-08-12T13:00:00Z"),
//     end_time: new Date("2024-08-12T15:00:00Z"),
//     organization_id: "cltyp30v10001qke0j5c80jhm",
//     tags: ["community", "seniors", "volunteering"],
//     address: "567 Walnut Blvd",
//     city: "Miami",
//     recurring: false,
//     online: false,
//     token_bounty: 20,
//     number_of_spots: 10,
//     event_volunteers: {
//       create: [],
//     },
//     status: "UPCOMING",
//     latitude: 25.7617,
//     longitude: -80.1918,
//   },
//   {
//     name: "Animal Shelter Adoption Day",
//     description: "Help find forever homes for shelter animals!",
//     start_time: new Date("2024-09-30T11:00:00Z"),
//     end_time: new Date("2024-09-30T15:00:00Z"),
//     organization_id: "cltyp30v10001qke0j5c80jhm",
//     tags: ["animals", "adoption", "volunteering"],
//     address: "890 Pineapple Ave",
//     city: "San Diego",
//     recurring: false,
//     online: false,
//     token_bounty: 0,
//     number_of_spots: 30,
//     event_volunteers: {
//       create: [],
//     },
//     status: "UPCOMING",
//     latitude: 32.7157,
//     longitude: -117.1611,
//   },
//   {
//     name: "Health Fair",
//     description: "Promote health and wellness in our community!",
//     start_time: new Date("2024-10-15T10:00:00Z"),
//     end_time: new Date("2024-10-15T14:00:00Z"),
//     organization_id: "cltyp30v10001qke0j5c80jhm",
//     tags: ["health", "wellness", "community"],
//     address: "678 Orange St",
//     city: "Houston",
//     recurring: false,
//     online: false,
//     token_bounty: 50,
//     number_of_spots: 20,
//     event_volunteers: {
//       create: [],
//     },
//     status: "UPCOMING",
//     latitude: 29.7604,
//     longitude: -95.3698,
//   },
//   {
//     name: "Youth Sports Camp",
//     description: "Teach kids the fundamentals of various sports!",
//     start_time: new Date("2024-11-10T09:00:00Z"),
//     end_time: new Date("2024-11-10T16:00:00Z"),
//     organization_id: "cltyp30v10001qke0j5c80jhm",
//     tags: ["youth", "sports", "education"],
//     address: "901 Cherry Ave",
//     city: "Dallas",
//     recurring: false,
//     online: false,
//     token_bounty: 0,
//     number_of_spots: 40,
//     event_volunteers: {
//       create: [],
//     },
//     status: "UPCOMING",
//     latitude: 32.7767,
//     longitude: -96.797,
//   },
];

/**
 * Populates the database with dummy events.
 * @endpoint GET /api/events/populate
 * @param {Request} request - The incoming request
 * @returns {Response} - The response to the incoming request
 */
export async function GET(request: Request) {
  // Loop through the dummy events and add them to the database.
  try {
    for (const event of dummyEvents) {
      await prisma.event.create({
        data: event,
      });
    }
  } catch (error) {
    // If there is an error adding the dummy events, return an error response.
    console.error(error);
    return new Response("Error adding dummy events: " + error, {
      status: 500,
    });
  }
  // Return a success message.
  return new Response("Events created", { status: 200 });
}
