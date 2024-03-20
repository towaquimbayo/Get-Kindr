"use client"

import { useState, useEffect, useMemo, useRef } from "react";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import { LucideSearch, LucideMapPin, LucideHeart } from "lucide-react";
import Link from "next/link";
import Map, { Marker } from "react-map-gl";
import { Event } from "@prisma/client";

type Coordinates = [number, number];

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchEvents() {
    // Query backend for events
      await fetch("/api/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const events = await res.json()
        const formattedEvents = events.map((event: any) => {
          return {
            ...event,
            ...convertTimeFormat(event),
          };
        });
        setEvents(formattedEvents as any || []);
        console.log("events: ", formattedEvents);
        return events
      }).catch((error) => {
        console.error("Error fetching events: ", error)
      });
    }

    fetchEvents();
  }, []);

  function convertTimeFormat(event: any): any {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);

    // Format start date
    const startDay = startDate.getUTCDate();
    const startMonth = months[startDate.getUTCMonth()];
    const startYear = startDate.getUTCFullYear();
    const startDateFormatted = `${startMonth} ${startDay < 10 ? '0' + startDay : startDay} ${startYear}`;

    // Format time range
    const startTimeHours = ('0' + startDate.getUTCHours()).slice(-2);
    const startTimeMinutes = ('0' + startDate.getUTCMinutes()).slice(-2);
    const endTimeHours = ('0' + endDate.getUTCHours()).slice(-2);
    const endTimeMinutes = ('0' + endDate.getUTCMinutes()).slice(-2);
    const timeRangeFormatted = `${startTimeHours}:${startTimeMinutes} AM - ${endTimeHours}:${endTimeMinutes} AM`;

    const result = {
        start_time: startDateFormatted,
        end_time: timeRangeFormatted,
    };

    return result;
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
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              (event as any).organization?.location
            )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
          );
          const data = await response.json();
          return data.features[0].center as Coordinates;
        })
      );
      
      setMarkerCoordinates(coordinates);
    };

    fetchMarkerCoordinates();
  }, [events]);

  return (
    <div className="my-12 w-full">
      <SectionTitle title="Apply and make an impact today." pretitle="volunteer events" align="left" />

      {/* Search and Filter */}
      <Container>
        <div className="h-[50px] rounded-xl flex divide-x shadow-[0_6px_25px_rgb(0,0,0,0.08)]">
          <div className="w-full h-full px-2 pl-3 rounded-s-xl flex items-center">
            <LucideSearch size={20} color="#000000" />
            <input className="w-full appearance-none bg-transparent border-none placeholder-gray-400 focus:ring-0" type="text" placeholder="Search opportunities" />
          </div>
          <div className="w-full h-full px-2 pl-3 flex items-center">
            <LucideMapPin size={20} color="#000000" />
            <input className="w-full appearance-none bg-transparent border-none placeholder-gray-400 focus:ring-0" type="text" placeholder="Vancouver, BC" />
          </div>
          <div className="w-full h-full px-2 flex items-center">
            <input className="w-full appearance-none bg-transparent border-none placeholder-gray-400 focus:ring-0" type="text" placeholder="Filter Tags" />
          </div>
          <div className="flex-none w-[125px] h-full bg-primary rounded-e-xl">
            <Link href="#" className="w-full h-full text-white flex items-center justify-center rounded-e-xl">Find Events</Link>
          </div>
        </div>
      </Container>

      {/* Info and Sort */}
      <Container className="flex items-center justify-between !py-0">
          <p className="text-xl font-semibold text-gray-800">Showing <span id="numEvents">{events.length}</span> events</p>
          <div className="flex items-center text-gray-400">
            <p>Sort by:</p>
            <select className="appearance-none bg-transparent border-none focus:ring-0">
              <option>Most Recent</option>
              <option>Oldest</option>
            </select>
          </div>
      </Container>

      {/* Events (left) + Map (right) */}
      <Container className="flex gap-8">
        {/* Events List */}
        <div className="flex-1 overflow-y-auto max-h-[500px]">
          {/* Event Card */}
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl border border-[#EAEAEA] p-6 mb-6 !transition-all duration-300 ease-in-out hover:shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary bg-opacity-10 rounded-lg px-4 py-2 text-center">
                    <p className="text-xs text-primary">{event.start_time.toString().split(' ')[0]}</p>
                    <p className="text-xl text-primary font-semibold">{event.start_time.toString().split(' ')[1]}</p>
                    <p className="text-xs text-primary">{event.start_time.toString().split(' ')[2]}</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{event.name}</p>
                    <p className="text-gray-600">{(event as any).organization.name}</p>
                    <p className="text-gray-600">{event.city} - {event.end_time.toString()}</p>
                  </div>
                </div>
                <Link href="#" className="">
                  <LucideHeart size={20} color="#cccccc" />
                </Link>
              </div>
              <p className="text-gray-500 mb-6">{event.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="inline-block bg-primary bg-opacity-10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>
                <Link href="#" className="bg-primary text-white px-4 py-2 rounded-lg">Apply</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Map Embed */}
        <div className="flex-1">
          <div className="rounded-3xl overflow-hidden" ref={mapContainerRef}>
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              initialViewState={{
                longitude: -123.05,
                latitude: 49.24,
                zoom: 10
              }}
              style={{width: '100%', height: 500, borderRadius: '1.5rem'}}
              mapStyle="mapbox://styles/mapbox/light-v10"
            >
              {markerCoordinates.map((coordinates, index) => (
                <Marker
                  key={index}
                  longitude={coordinates[0]}
                  latitude={coordinates[1]}
                  anchor="center"
                  offset={[mapDimensions.width / 2, -mapDimensions.height]}
                >
                  <div className="bg-primary w-2 h-2 rounded-full"></div>
                </Marker>
              ))}
            </Map>
          </div>
        </div>
      </Container>
    </div>
  );
}
