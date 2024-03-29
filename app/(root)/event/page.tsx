"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  Coins,
  Edit,
  LucideBuilding,
  MapPin,
  Tv,
  User,
  Users,
} from "lucide-react";
import { getDate, getTime } from "@/components/shared/utils";
import Image from "next/image";

export default function Event() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [event, setEvent] = useState({
    id: "",
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    organization: "",
    tags: [],
    city: "",
    status: "",
    numberOfSpots: 0,
    online: false,
    recurring: false,
    tokenBounty: 0,
    volunteers: [],
    isFavourite: false,
  });
  const [isFetching, setIsFetching] = useState(true);
  const eventId = searchParams.get("id");
  const isOrganization = session?.accountType.toLowerCase() === "organization";
  const status = event.status.charAt(0).toUpperCase() + event.status.slice(1);

  useEffect(() => {
    if (!session && sessionStatus === "unauthenticated") router.push("/");
  }, [session, sessionStatus, router]);

  useEffect(() => {
    async function fetchEvents() {
      await fetch("/api/events?eventID=" + eventId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          const fetchedEvent = await res.json();
          if (!fetchedEvent) {
            console.error("No event found", fetchedEvent);
            return;
          }
          console.log("Fetched Event:", fetchedEvent);
          setEvent({
            id: fetchedEvent.id,
            name: fetchedEvent.name,
            description: fetchedEvent.description,
            startTime: fetchedEvent.start_time,
            endTime: fetchedEvent.end_time,
            organization: fetchedEvent.organization.name,
            tags: fetchedEvent.tags,
            city: fetchedEvent.city,
            status: fetchedEvent.status.toLowerCase(),
            numberOfSpots: fetchedEvent.number_of_spots,
            online: fetchedEvent.online,
            recurring: fetchedEvent.recurring,
            tokenBounty: fetchedEvent.token_bounty,
            // volunteers: fetchedEvent.event_volunteers || [],
            volunteers: [
              {
                id: "1",
                name: "John Doe",
                email: "john@example.com",
                profilePicture:
                  "https://randomuser.me/api/portraits/men/79.jpg",
              },
              {
                id: "2",
                name: "Jane Doe",
                email: "jane@example.com",
                profilePicture:
                  "https://randomuser.me/api/portraits/women/3.jpg",
              },
              {
                id: "3",
                name: "Alice Smith",
                email: "alice@example.com",
                profilePicture:
                  "https://randomuser.me/api/portraits/women/60.jpg",
              },
              {
                id: "4",
                name: "Bob Smith",
                email: "bob@example.com",
                profilePicture:
                  "https://randomuser.me/api/portraits/men/21.jpg",
              },
              {
                id: "5",
                name: "Eve Johnson",
                email: "eve@example.com",
                profilePicture:
                  "https://randomuser.me/api/portraits/women/36.jpg",
              },
              {
                id: "6",
                name: "Charlie Johnson",
                email: "charlie@example.com",
                perfilPicture:
                  "https://randomuser.me/api/portraits/women/47.jpg",
              },
              {
                id: "7",
                name: "David Brown",
                email: "david@example.com",
                profilePicture:
                  "https://randomuser.me/api/portraits/men/46.jpg",
              },
            ] as any,
            isFavourite: false,
          });
        })
        .catch((error) => {
          console.error("Error finding event: ", error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
    fetchEvents();
  }, [eventId]);

  if (isFetching) {
    return (
      <div className="mt-28 flex w-full max-w-screen-xl flex-col p-8">
        <p className="animate-pulse text-center text-[#858585] transition-all">
          Loading event...
        </p>
      </div>
    );
  }
  return (
    <div className="mb-12 mt-28 flex w-full max-w-screen-xl flex-col p-8">
      <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="font-display text-4xl font-bold text-black md:text-5xl">
          {event.name}
          {isOrganization && <Edit size={18} />}
        </h1>
        <div className="rounded-full bg-primary px-4 py-2 text-md text-white md:text-lg">
          <p className="px-1">{status}</p>
        </div>
      </div>

      <div className="mb-4 mt-12 flex w-full flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col items-start gap-4 lg:w-3/4">
          <div className="flex flex-col items-start gap-2 text-md text-[#4b4b4b] md:text-lg sm:flex-row">
            <div className="flex items-center gap-2">
              <LucideBuilding size={20} />
              <p>{event.organization}</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <p>{event.city}</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <p>
                {getDate(event.startTime)} &bull; {getTime(event.startTime)} -{" "}
                {getTime(event.endTime)}
              </p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-4">
            {event.tags.map((tag: string) => (
              <div
                key={tag}
                className="text-sm rounded-full bg-primary bg-opacity-10 px-4 py-1.5 text-primary md:text-md"
              >
                #{tag}
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col justify-center gap-4 rounded-lg border border-[#EAEAEA] bg-white p-4 lg:w-1/4 lg:flex-col lg:items-start lg:gap-4 sm:flex-row sm:gap-12">
          <div className="flex flex-row items-center gap-4 text-[#4b4b4b] md:flex-row sm:flex-col">
            <Users size={20} />
            <h2 className="text-md md:text-lg">{event.numberOfSpots} spots available</h2>
          </div>
          <div className="flex flex-row items-center gap-4 text-[#4b4b4b] md:flex-row sm:flex-col">
            <Coins size={20} />
            <h2 className="text-md md:text-lg">{event.tokenBounty} tokens</h2>
          </div>
          <div className="flex flex-row items-center gap-4 text-[#4b4b4b] md:flex-row sm:flex-col">
            {event.online ? (
              <>
                <Tv size={20} />
                <h2 className="text-md md:text-lg">Online</h2>
              </>
            ) : (
              <>
                <User size={20} />
                <h2 className="text-md md:text-lg">In-person</h2>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col">
        <h2 className="mb-4 text-3xl font-semibold">Description</h2>
        <p>{event.description}</p>
      </div>

      <div className="mt-12 flex w-full flex-col gap-4">
        <h2 className="mb-4 text-3xl font-semibold">
          Event Volunteers{" "}
          <span className="font-normal text-[#858585]">
            ({event.volunteers.length})
          </span>
        </h2>
        {!event.volunteers || event.volunteers.length === 0 ? (
          <p className="text-lg text-[#858585]">
            No volunteers have signed up for this event yet.
          </p>
        ) : (
          <div className="flex w-full flex-wrap justify-between gap-4">
            {event.volunteers.map((volunteer: any) => (
              <div
                key={volunteer.id}
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-[#EAEAEA] bg-white p-4 transition-all duration-300 ease-in-out hover:shadow-md md:w-[48%]"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={volunteer.profilePicture || "/default_profile_img.png"}
                    alt={volunteer.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 items-start justify-between gap-0.5">
                    <p className="text-lg font-semibold">{volunteer.name}</p>
                    <p className="text-md text-[#4b4b4b]">{volunteer.email}</p>
                  </div>
                </div>
                {isOrganization && (
                  <div className="flex items-center gap-4">
                    <button className="text-primary">Remove</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}