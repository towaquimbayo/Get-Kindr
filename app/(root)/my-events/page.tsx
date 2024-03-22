"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Calendar, Edit, LucideBuilding, MapPin } from "lucide-react";
import React, { Key, useEffect, useMemo, useState } from "react";

const EventCard = React.memo(function EventCard({
  event,
  isOrganization,
}: {
  event: any;
  isOrganization: boolean;
}) {
  const router = useRouter();

  function getDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function getTime(date: string) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  }

  return (
    <Card
      key={event.id}
      shadow="none"
      className="rounded-lg border border-[#EAEAEA] bg-white !transition-all duration-300 ease-in-out hover:shadow-md"
    >
      <CardBody
        className="w-full p-6 hover:cursor-pointer md:p-8"
        onClick={() => {
          if (isOrganization) router.push(`/edit-event?id=${event.id}`);
          else router.push(`/events?id=${event.id}`);
        }}
      >
        <div className="mb-4 flex w-full flex-col items-start justify-between gap-4 md:mb-2 md:flex-row md:items-center md:gap-0">
          <div className="flex w-full items-center gap-4">
            <h1 className="text-xl font-semibold md:text-2xl">{event.name}</h1>
            {isOrganization && <Edit size={18} />}
          </div>
          <div className="rounded-full bg-primary px-4 py-2 text-white">
            <p className="px-1">{event.status}</p>
          </div>
        </div>
        <div className="mb-4 flex w-full flex-col items-start gap-2 text-sm md:flex-row md:items-center lg:gap-4 lg:text-base">
          <div className="flex items-center gap-2 text-[#4b4b4b]">
            <LucideBuilding size={18} />
            <p>{event.organization}</p>
          </div>
          <div className="flex items-center gap-2 text-[#4b4b4b]">
            <MapPin size={18} />
            <p>{event.location}</p>
          </div>
          <div className="flex items-center gap-2 text-[#4b4b4b]">
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
              {tag}
            </div>
          ))}
        </div>
        <p>{event.description}</p>
      </CardBody>
    </Card>
  );
});

export default function MyEvents() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const tabLabels = ["All", "Completed", "Upcoming"];
  const [selectedTab, setSelectedTab] = useState("All");
  const userTokens = 0;
  const isOrganization = session?.accountType.toLowerCase() === "organization";

  useEffect(() => {
    if (!session || status !== "authenticated") router.push("/login");
  }, [session, status, router]);

  const filteredEvents = useMemo(() => {
    const events = [
      {
        id: 1,
        name: "School Outreach Activity Leader",
        description:
          "Every year, we bring arts and culture to classrooms across Vancouver. Through craft workshops and storytelling, we learn about the diverse cultures that make up our wonderful community. If you like stories, and being creative, volunteer to be a ...",
        startTime: "2022-10-01T09:00:00",
        endTime: "2022-10-01T12:00:00",
        organization: "Vancouver School Board",
        tags: ["Education", "Arts", "Children", "Inperson", "Storytelling"],
        location: "Vancouver, BC",
        status: "Completed",
        isFavourite: false,
      },
      {
        id: 2,
        name: "Community Garden Maintenance",
        description:
          "We are looking for volunteers to help us maintain our community garden. We have a variety of tasks available, including weeding, watering, and planting. If you have a green thumb, or are looking to develop one, we would love to have you join us!",
        startTime: "2022-10-21T09:00:00",
        endTime: "2022-10-21T12:00:00",
        organization: "Burnaby Community Garden Society",
        tags: ["Gardening", "Community", "Outdoors", "Inperson"],
        location: "Burnaby, BC",
        status: "Upcoming",
        isFavourite: true,
      },
      {
        id: 3,
        name: "Food Bank Volunteer",
        description:
          "We are looking for volunteers to help us sort and pack food donations. We are also looking for volunteers to help us distribute food to our clients. If you are looking to make a difference in your community, we would love to have you join us!",
        startTime: "2022-10-01T09:00:00",
        endTime: "2022-10-01T12:00:00",
        organization: "Richmond Food Bank",
        tags: ["Community", "Food", "Inperson"],
        location: "Richmond, BC",
        status: "Completed",
        isFavourite: true,
      },
      {
        id: 4,
        name: "Community Kitchen Volunteer",
        description:
          "We are looking for volunteers to help us prepare and serve meals at our community kitchen. If you are passionate about food, and want to make a difference in your community, we would love to have you join us!",
        startTime: "2022-10-01T09:00:00",
        endTime: "2022-10-01T12:00:00",
        organization: "North Vancouver Community Kitchen",
        tags: ["Community", "Food", "Inperson"],
        location: "North Vancouver, BC",
        status: "Upcoming",
        isFavourite: false,
      },
    ];

    return events.filter((event) => {
      if (selectedTab === "All") return true;
      if (selectedTab === "Completed") {
        return event.status === "Completed";
      }
      if (selectedTab === "Upcoming") {
        return event.status === "Upcoming";
      }
      return false;
    });
  }, [selectedTab]);

  return (
    <div className="mx-auto mb-auto mt-28 flex w-full max-w-screen-xl flex-col gap-8 p-8">
      <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <h2 className="font-display text-5xl font-bold text-black">
          My Events
        </h2>
        <p className="text-lg">
          Total hours: <span className="font-bold">{userTokens}h</span>
        </p>
      </div>

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
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isOrganization={isOrganization}
                  />
                ))}
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
