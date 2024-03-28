"use client";

import { useState, useEffect, useRef } from "react";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import { LucideSearch, LucideMapPin, LucideHeart } from "lucide-react";
import Link from "next/link";
import Button from "@/components/layout/button";
import Map, { Marker } from "react-map-gl";
import { Event } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Coordinates = [number, number];

export default function Events() {
  const { data: session } = useSession();

  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(session?.user); // User details
  const [isFetching, setIsFetching] = useState(true);

  const {
    email,
  }: {
    email?: string | null;
  } = session?.user || {};

  useEffect(() => {
    async function fetchEvents() {
      // Query backend for events
      setIsFetching(true);
      await fetch("/api/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          const events = await res.json();
          const formattedEvents = events.map((event: any) => {
            return {
              ...event,
              ...convertTimeFormat(event),
              applied: event.event_volunteers.some(
                (ev: any) => ev.volunteerId === user?.volunteerId,
              ),
            };
          });
          setEvents((formattedEvents as any) || []);
          return events;
        })
        .catch((error) => {
          console.error("Error fetching events: ", error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }

    fetchEvents();
  }, [user]);

  function convertTimeFormat(event: any): any {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);

    // Format start date
    const startDay = startDate.getUTCDate();
    const startMonth = months[startDate.getUTCMonth()];
    const startYear = startDate.getUTCFullYear();
    const startDateFormatted = `${startMonth} ${
      startDay < 10 ? "0" + startDay : startDay
    } ${startYear}`;

    // Format time range
    const startTimeHours = ("0" + startDate.getUTCHours()).slice(-2);
    const startTimeMinutes = ("0" + startDate.getUTCMinutes()).slice(-2);
    const endTimeHours = ("0" + endDate.getUTCHours()).slice(-2);
    const endTimeMinutes = ("0" + endDate.getUTCMinutes()).slice(-2);
    const timeRangeFormatted = `${startTimeHours}:${startTimeMinutes} AM - ${endTimeHours}:${endTimeMinutes} AM`;

    const result = {
      start_time: startDateFormatted,
      end_time: timeRangeFormatted,
    };

    return result;
  }

  function applyToEvent(eventId: string) {
    // If user is not logged in, redirect to login page'
    if (!session) {
      router.push("/login");
    } else {
      const volunteerId = user.volunteerId;
      const data = { volunteerId, eventId };
      fetch("/api/events/attendees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (res.ok) {
          const response = await res.json();
          console.log("Attendee added successfully: ", response);
          // TODO: must redirect to the event page
        } else {
          console.error("Error adding attendee: ", res);
        }
      });
    }
  }

  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [markerCoordinates, setMarkerCoordinates] = useState<Coordinates[]>([]);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const { width, height } = mapContainerRef.current.getBoundingClientRect();
      setMapDimensions({ width, height });
    }
  }, []);

  useEffect(() => {
    const fetchMarkerCoordinates = async () => {
      const coordinates = await Promise.all(
        events.map(async (event) => {
          const address = `${event.address}, ${event.city}`;
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              address,
            )}.json?access_token=${
              process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
            }`,
          );
          const data = await response.json();
          return data.features[0].center as Coordinates;
        }),
      );

      setMarkerCoordinates(coordinates);
    };

    fetchMarkerCoordinates();
  }, [events]);

  useEffect(() => {
    async function getUserDetails() {
      const url = encodeURIComponent(email || "");
      const res = await fetch(`/api/auth?email=${url}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error fetching user details: ", error);
        return;
      }
      const jsonRes = await res.json();
      const userInfo = jsonRes.user;

      if (!userInfo) {
        console.error("User not found");
        return;
      }
      setUser(userInfo);
    }

    if (email) getUserDetails();
  }, [email]);

  return (
    <div className="my-12 w-full">
      <SectionTitle
        title="Apply and make an impact today."
        pretitle="volunteer events"
        align="left"
      />

      {/* Search and Filter */}
      <Container>
        <div className="flex h-[50px] divide-x rounded-xl shadow-[0_6px_25px_rgb(0,0,0,0.08)]">
          <div className="flex h-full w-full items-center rounded-s-xl px-2 pl-3">
            <LucideSearch size={20} color="#000000" />
            <input
              className="w-full appearance-none border-none bg-transparent placeholder-gray-400 focus:ring-0"
              type="text"
              placeholder="Search opportunities"
            />
          </div>
          <div className="flex h-full w-full items-center px-2 pl-3">
            <LucideMapPin size={20} color="#000000" />
            <input
              className="w-full appearance-none border-none bg-transparent placeholder-gray-400 focus:ring-0"
              type="text"
              placeholder="Vancouver, BC"
            />
          </div>
          <div className="flex h-full w-full items-center px-2">
            <input
              className="w-full appearance-none border-none bg-transparent placeholder-gray-400 focus:ring-0"
              type="text"
              placeholder="Filter Tags"
            />
          </div>
          <div className="h-full w-[125px] flex-none rounded-e-xl bg-primary">
            <Link
              href="#"
              className="flex h-full w-full items-center justify-center rounded-e-xl text-white"
            >
              Find Events
            </Link>
          </div>
        </div>
      </Container>

      {/* Info and Sort */}
      <Container className="flex items-center justify-between !py-0">
        <p className="text-xl font-semibold text-gray-800">
          Showing <span id="numEvents">{events.length}</span> events
        </p>
        <div className="flex items-center text-gray-400">
          <p>Sort by:</p>
          <select className="appearance-none border-none bg-transparent focus:ring-0">
            <option>Most Recent</option>
            <option>Oldest</option>
          </select>
        </div>
      </Container>

      {/* Events (left) + Map (right) */}
      <Container className="flex gap-8">
        {isFetching ? (
          <p className="animate-pulse text-[#858585] transition-all">
            Loading events...
          </p>
        ) : (
          <>
            {/* Events List */}
            <div className="max-h-[500px] flex-1 overflow-y-auto">
              {/* Event Card */}
              {events.map((event) => (
                <div
                  key={event.id}
                  className="mb-6 rounded-xl border border-[#EAEAEA] bg-white p-6 !transition-all duration-300 ease-in-out hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary bg-opacity-10 px-4 py-2 text-center">
                        <p className="text-xs text-primary">
                          {event.start_time.toString().split(" ")[0]}
                        </p>
                        <p className="text-xl font-semibold text-primary">
                          {event.start_time.toString().split(" ")[1]}
                        </p>
                        <p className="text-xs text-primary">
                          {event.start_time.toString().split(" ")[2]}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{event.name}</p>
                        <p className="text-gray-600">
                          {(event as any).organization.name}
                        </p>
                        <p className="text-gray-600">
                          {event.city} - {event.end_time.toString()}
                        </p>
                      </div>
                    </div>
                    <Link href="#" className="">
                      <LucideHeart size={20} color="#cccccc" />
                    </Link>
                  </div>
                  <p className="mb-6 text-gray-500">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded bg-primary bg-opacity-10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          #&nbsp;{tag}
                        </span>
                      ))}
                    </div>
                    {/* Align the button to the left */}
                    <Button
                      onClick={() => applyToEvent(event.id)}
                      className="!mr-0 rounded-lg bg-primary px-4 py-2 text-white"
                      disabled={event.applied}
                    >
                      {event.applied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Embed */}
            <div className="flex-1">
              <div
                className="overflow-hidden rounded-3xl"
                ref={mapContainerRef}
              >
                <Map
                  mapboxAccessToken={
                    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
                  }
                  initialViewState={{
                    longitude: -123.05,
                    latitude: 49.24,
                    zoom: 10,
                  }}
                  style={{ width: "100%", height: 500, borderRadius: "1.5rem" }}
                  mapStyle="mapbox://styles/mapbox/light-v10"
                >
                  {markerCoordinates.map((coordinates, index) => (
                    <Marker
                      key={index}
                      longitude={coordinates[0]}
                      latitude={coordinates[1]}
                      anchor="center"
                      offset={[
                        mapDimensions.width / 2,
                        -mapDimensions.height - 20,
                      ]}
                    >
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </Marker>
                  ))}
                </Map>
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
