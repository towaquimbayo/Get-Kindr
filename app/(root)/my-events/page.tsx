"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Calendar, LucideBuilding, MapPin } from "lucide-react";
import React, { Key, useEffect, useMemo, useState } from "react";
import { getDate, getTime } from "@/components/shared/utils";

const EventCard = React.memo(function EventCard({
  event,
  isOrganization,
}: {
  event: any;
  isOrganization: boolean;
}) {
  const router = useRouter();

  // Title case the status
  const statusName =
    event.status.charAt(0).toUpperCase() + event.status.slice(1);
  return (
    <Card
      key={event.id}
      shadow="none"
      className="w-full rounded-lg border border-[#EAEAEA] bg-white !transition-all duration-300 ease-in-out hover:shadow-md"
    >
      <CardBody
        className="w-full p-6 hover:cursor-pointer md:p-8"
        onClick={() => router.push(`/event?id=${event.id}`)}
      >
        <div className="mb-4 flex w-full flex-col items-start justify-between gap-4 md:mb-2 md:flex-row md:items-center md:gap-0">
          <div className="flex w-full items-center gap-4">
            <h1 className="text-xl font-semibold text-secondary md:text-2xl">{event.name}</h1>
          </div>
          <div className="rounded-full bg-primary px-4 py-2 text-white">
            <p className="px-1">{statusName}</p>
          </div>
        </div>
        <div className="mb-4 flex w-full flex-col items-start gap-2 text-sm md:flex-row md:items-center lg:gap-4 lg:text-base">
          <div className="flex items-center gap-2 text-secondary opacity-80">
            <LucideBuilding size={18} />
            <p>{event.organization}</p>
          </div>
          <div className="flex items-center gap-2 text-secondary opacity-80">
            <MapPin size={18} />
            <p>{event.location}</p>
          </div>
          <div className="flex items-center gap-2 text-secondary opacity-80">
            <Calendar size={18} />
            <p>
              {getDate(event.startTime)} &bull; {getTime(event.startTime)} -{" "}
              {getTime(event.endTime)}
            </p>
          </div>
        </div>
        <div className="mb-4 flex w-full flex-wrap items-center gap-4 ">
          {event.tags.map((tag: string) => (
            <div
              key={tag}
              className="rounded-full bg-primary bg-opacity-10 px-4 py-1 text-sm text-primary"
            >
              #{tag}
            </div>
          ))}
        </div>
        <p className="text-secondary">{event.description}</p>
      </CardBody>
    </Card>
  );
});

export default function MyEvents() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState("All");
  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [totalVolHours, setTotalVolHours] = useState(0);

  const tabLabels = ["All", "Completed", "Upcoming"];
  const isOrganization = session?.accountType.toLowerCase() === "organization";

  useEffect(() => {
    if (!session || status !== "authenticated") router.push("/login");
  }, [session, status, router]);

  useEffect(() => {
    async function fetchEvents() {
      await fetch("/api/events/myevents", {
        method: "GET",
      })
        .then(async (res) => {
          const events = await res.json();
          if (!events || !events.length || events.length === 0) {
            console.error("No events found", events);
            return;
          }
          console.log("Fetched Events:", events);

          let totalHours = 0;
          const formattedEvents = events.map((event: any) => {
            // Calculate total hours
            const startTime = new Date(event.start_time);
            const endTime = new Date(event.end_time);
            totalHours +=
              (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

            // Braden: Added code to check date and update visual for event status.
            if (
              new Date(event.end_time) < new Date() &&
              event.status !== "completed"
            ) {
              event.status = "completed";
            }

            // Format the event data
            return {
              id: event.id,
              name: event.name,
              description: event.description,
              startTime: event.start_time,
              endTime: event.end_time,
              organization: event.organization.name,
              tags: event.tags,
              location: event.city,
              status: event.status.toLowerCase(),
              isFavourite: false,
            };
          });
          console.log("Formatted Events:", formattedEvents);
          setEvents(formattedEvents || []);
          setTotalVolHours(totalHours);
        })
        .catch((error) => {
          console.error("Error fetching events: ", error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (!events || !events.length || events.length === 0) return [];
    return events.filter((event: { status: string }) => {
      if (selectedTab === "All") return true;
      if (selectedTab === "Completed") {
        return event.status === "completed";
      }
      if (selectedTab === "Upcoming") {
        return event.status === "upcoming";
      }
      return false;
    });
  }, [events, selectedTab]);

  return (
    <div className="mx-auto mb-auto mt-28 flex w-full max-w-screen-xl flex-col gap-8 p-8">
      <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <h2 className="font-display text-5xl font-bold text-secondary">
          My Events
        </h2>
        {isOrganization ? (
          <p className="text-lg">
            Total events: <span className="font-bold">{events.length}</span>
          </p>
        ) : (
          <p className="text-lg">
            Total hours:{" "}
            <span className="font-bold">{totalVolHours.toFixed(2)}h</span>
          </p>
        )}
      </div>

      {isFetching ? (
        <p className="animate-pulse text-[#858585] transition-all">
          Loading events...
        </p>
      ) : (
        <div className="flex w-full flex-col">
          <Tabs
            color="primary"
            aria-label="Tab labels"
            radius="lg"
            size="lg"
            className="mb-8"
            onSelectionChange={(key: Key) => {
              setSelectedTab(tabLabels[tabLabels.indexOf(key as string)]);
            }}
          >
            {tabLabels.map((label) => (
              <Tab key={label} title={<div className="px-2">{label}</div>}>
                <div className="flex flex-wrap gap-8">
                  {filteredEvents.length === 0 ? (
                    <p>No events found</p>
                  ) : (
                    filteredEvents.map((event: { id: string }) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        isOrganization={isOrganization}
                      />
                    ))
                  )}
                </div>
              </Tab>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
}
