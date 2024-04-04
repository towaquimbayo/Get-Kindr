import prisma from "@/lib/prisma";

// Define the fields that can be searched by.
const SEARCH_FIELDS = {
  name: "String",
  description: "String",
  start_time: "DateTime", // Format: "YYYY-MM-DD"
  end_time: "DateTime", // Format: "YYYY-MM-DD"
  organization_id: "String",
  organization: "String",
  tags: "String[]",
  address: "String",
  city: "String",
  token_bounty: "Int",
};

// Define the fields that can be sorted by.
const SORT_FIELDS = [
  "start_time",
  "end_time",
  "name",
  // "distance",     // TODO: Implement distance sorting
  "token_bounty",
];

// Define the sort modes.
const SORT_MODES = ["asc", "desc"];

// Define the default values for the search and sort parameters.
const DEFAULT = {
  sortField: "start_time",
  sortMode: "asc",
  searchMode: null,
  timeAll: false,
};

/**
 * Endpoint for getting events: GET /api/events
 *
 * request parameters (optional):
 * - eventID: an event ID within the database
 * - searchMode: field to search for events. see SEARCH_FIELDS
 * - search: search term to use, not case sensitive
 * - all: boolean to include all events, regardless of time
 * - sortBy: field to use for sorting. see SORT_FIELDS
 * - sortOrder: order to sort by. see SORT_MODES
 *
 * Default behavior for invalid parameters: see DEFAULT
 *
 * @param {Request} request - The incoming request
 */
export async function GET(request: Request) {
  try {
    // Parse the URL to get the parameters for eventID and search Mode.
    const url = new URL(request.url);
    const eventID = url.searchParams.get("eventID");
    let searchMode = url.searchParams.get("searchMode");
    // Check if the searchMode is valid, otherwise use the default.
    searchMode =
      searchMode && searchMode in SEARCH_FIELDS
        ? searchMode
        : DEFAULT.searchMode;
    const searchTerm = url.searchParams.get("search")
      ? url.searchParams.get("search")
      : null;

    // Check if the all parameter is present, otherwise use the default.
    const allTime =
      url.searchParams.get("all") === "true" ? true : DEFAULT.timeAll;

    // Check if the sortBy parameter is present, otherwise use the default.
    let sortField = url.searchParams.get("sortField");
    sortField =
      sortField && SORT_FIELDS.includes(sortField)
        ? sortField
        : DEFAULT.sortField;

    let sortMode = url.searchParams.get("sortMode");
    sortMode =
      sortMode && SORT_MODES.includes(sortMode) ? sortMode : DEFAULT.sortMode;

    // Get the current time.
    const currentTime = !allTime ? new Date() : new Date(0);

    // Initialize the events variable.
    let events;

    // If no parameters are present, return all upcoming events

    if (eventID) {
      // If eventID is present, get event by ID
      // Stitch in the entire organization object
      events = await prisma.event.findUnique({
        where: {
          id: eventID,
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          event_volunteers: {
            include: {
              volunteer: {
                select: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                      image: true,
                    },
                  },
                },
              },
            },

          },
        },
      });
    } else if (searchMode && searchTerm) {
      // If searchMode and searchTerm are present, search for events
      let { searchQuery, timeQuery } = parseQuery(searchMode, searchTerm);
      // Find all events that match the search query using searchQuery, timeQuery, sortField and sortMode
      events = await prisma.event.findMany({
        where: {
          ...searchQuery,
          ...timeQuery,
        },
        orderBy: {
          [sortField]: sortMode,
        },
        include: {
          organization: {
            select: {
              name: true,
            },
          },
          event_volunteers: true,
        },
      });
    } else {
      // Default: get all upcoming events
      events = await prisma.event.findMany({
        where: {
          start_time: {
            gte: currentTime,
          },
        },
        orderBy: {
          [sortField]: sortMode,
        },
        include: {
          organization: {
            select: {
              name: true,
            },
          },
          event_volunteers: true,
        },
      });
    }
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

/**
 * Parses the searchMode and searchTerm to create the Prisma query.
 *
 * @param searchMode The field to search for events. see SEARCH_FIELDS
 * @param searchTerm The string to use to search.
 * @returns Formatted query for Prisma.
 */
function parseQuery(searchMode: string, searchTerm: string) {
  // Initialize the searchQuery and determine its type or if it is empty.
  let searchQuery = {};
  if (SEARCH_FIELDS[searchMode as keyof typeof SEARCH_FIELDS] === "String") {
    searchQuery = {
      [searchMode]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    };
  } else if (
    SEARCH_FIELDS[searchMode as keyof typeof SEARCH_FIELDS] === "String[]"
  ) {
    searchQuery = {
      [searchMode]: {
        hasSome: searchTerm.split(","),
      },
    };
  } else if (
    SEARCH_FIELDS[searchMode as keyof typeof SEARCH_FIELDS] === "Int"
  ) {
    searchQuery = {
      [searchMode]: parseInt(searchTerm),
    };
  } else {
    searchQuery = {};
  }

  // Initialize the timeQuery and determine its type.
  let timeQuery = {};
  if (SEARCH_FIELDS[searchMode as keyof typeof SEARCH_FIELDS] === "DateTime") {
    timeQuery = {
      [searchMode]: {
        gte: new Date(searchTerm + "T00:00:00.000Z"),
        lte: new Date(searchTerm + "T23:59:59.999Z"),
      },
    };
  } else {
    timeQuery = {
      start_time: {
        gte: new Date(),
      },
    };
  }

  // Return the searchQuery and timeQuery.
  return {
    searchQuery,
    timeQuery,
  };
}
