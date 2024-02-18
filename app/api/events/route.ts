import prisma from "@/lib/prisma";

const SEARCH_FIELDS = [
  "name",             // String
  "description",      // String
  "start_time",       // DateTime
  "end_time",         // DateTime
  "organization_id",  // String
  "organization",     // String
  "tags",             // String[]
  "address",          // String
  "city",             // String
  "token_bounty",     // Int
];

const SORT_FIELDS = [
  "start_time",
  "end_time",
  "name",
  "distance", // TODO: Implement distance sorting
  "token_bounty"
];

const SORT_MODES = [
  "asc",
  "desc"
];

const DEFAULT = {
  sortField: "start_time",
  sortMode: "asc",
  searchMode: null,
};

/**
 * Endpoint for getting events: GET /api/events
 * 
 * request parameters (optional):
 * - eventID: an event ID within the database
 * - searchMode: field to search for events. see SEARCH_FIELDS
 * - search: search term to use, not case sensitive
 * - sortBy: field to use for sorting. see SORT_FIELDS
 * - sortOrder: order to sort by. see SORT_MODES
 * 
 * Default behavior for invalid parameters: see DEFAULT
 * 
 * @param {Request} request - The incoming request
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    console.log("url search params", url.searchParams);

    const eventID = url.searchParams.get("eventID");

    const searchMode = SEARCH_FIELDS.includes(url.searchParams.get("searchMode")) 
      ? url.searchParams.get("searchMode") : DEFAULT.searchMode;
    const searchTerm = url.searchParams.get("search") ? url.searchParams.get("search") : null;

    const sortField = SORT_FIELDS.includes(url.searchParams.get("sortField")) 
      ? url.searchParams.get("sortField") : DEFAULT.sortField;
    const sortMode = SORT_MODES.includes(url.searchParams.get("sortMode")) 
      ? url.searchParams.get("sortMode") : DEFAULT.sortMode;

    const currentTime = new Date();

    let events = null;

    if (eventID) { // If eventID is present, get event by ID
      events = await prisma.event.findUnique({
        where: { id: eventID },
      });
    } else if (searchMode && searchTerm) { // If searchMode and searchTerm are present, search for events
      console.log("searchMode", searchMode);
      console.log("searchTerm", searchTerm);
      if (SEARCH_FIELDS.includes(searchMode)) {
        events = await prisma.event.findMany({
          where: {
            [searchMode]: {
              contains: searchTerm,
              mode: "insensitive"
            },
            start_time: {
              gte: currentTime
            }
          },
          orderBy: {
            [sortField]: sortMode
          }
        });
      }
    } else { // Default
      events = await prisma.event.findMany({
        where: {
          start_time: {
            gte: currentTime
          }
        },
        orderBy: {
          [sortField]: sortMode
        }
      });
    }

    return new Response(JSON.stringify(events), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error getting events: " + error, {
      status: 500,
    });
  }
}
