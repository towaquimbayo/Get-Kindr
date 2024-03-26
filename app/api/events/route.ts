import prisma from "@/lib/prisma";

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

const SORT_FIELDS = [
  "start_time",
  "end_time",
  "name",
  // "distance",     // TODO: Implement distance sorting
  "token_bounty",
];

const SORT_MODES = ["asc", "desc"];

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
    const url = new URL(request.url);

    const eventID = url.searchParams.get("eventID");

    let searchMode = url.searchParams.get("searchMode");
    searchMode =
      searchMode && searchMode in SEARCH_FIELDS
        ? searchMode
        : DEFAULT.searchMode;
    const searchTerm = url.searchParams.get("search")
      ? url.searchParams.get("search")
      : null;

    const allTime =
      url.searchParams.get("all") === "true" ? true : DEFAULT.timeAll;

    let sortField = url.searchParams.get("sortField");
    sortField =
      sortField && SORT_FIELDS.includes(sortField)
        ? sortField
        : DEFAULT.sortField;

    let sortMode = url.searchParams.get("sortMode");
    sortMode =
      sortMode && SORT_MODES.includes(sortMode) ? sortMode : DEFAULT.sortMode;

    const currentTime = !allTime ? new Date() : new Date(0);

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
              name: true,
            },
          },
        },
      });
    } else if (searchMode && searchTerm) {
      // If searchMode and searchTerm are present, search for events
      let { searchQuery, timeQuery } = parseQuery(searchMode, searchTerm);

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
        },
      });
    }

    return new Response(JSON.stringify(events), { status: 200 });
  } catch (error) {
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

  return {
    searchQuery,
    timeQuery,
  };
}
