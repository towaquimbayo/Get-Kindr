"use client";

import { useState, useEffect, useRef } from "react";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import { LucideSearch, LucideMapPin, LucideHeart, LucideHeartHandshake, LucideGem } from "lucide-react";
import Link from "next/link";
import Button from "@/components/layout/button";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Event } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Coordinates = [number, number];

export default function Events() {
  const { data: session } = useSession();
  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(session?.user); // User details
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [isFetchingVolunteers, setIsFetchingVolunteers] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchTags, setSearchTags] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'recent' | 'tokens'>('recent');

  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [markerCoordinates, setMarkerCoordinates] = useState<Coordinates[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API || "",
  });

  useEffect(() => {
    const fetchMarkerCoordinates = async () => {
      const coordinates = await Promise.all(
        events.map(async (event) => {
          const address = `${event.address}, ${event.city}`;
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address,
            )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}`,
          );
          const data = await response.json();
          if (data.status == 'OK') {
            const { lat, lng } = data.results[0].geometry.location;
            return [lat, lng] as Coordinates;
          } else {
            console.error('Error fetching coordinates: ', data);
            return [0, 0] as Coordinates;
          }
        }),
      );
      setMarkerCoordinates(coordinates);
    };

    fetchMarkerCoordinates();
  }, [events]);

  const handleMarkerClick = (eventIndex: number) => {
    const eventCard = document.getElementById(`event-${eventIndex}`);
    if (eventCard) {
      eventCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const filterEvents = (searchText: string, searchLocation: string, searchTags: string) => {
    if (searchText || searchLocation || searchTags) {
      const regex = new RegExp(searchText, "i"); // i = case insensitive
      const locationRegex = new RegExp(searchLocation, "i");
      const tagsRegex = new RegExp(searchTags, "i");
      return events.filter(
        (event) =>
          (regex.test(event.name) || regex.test(event.description)) &&
          locationRegex.test(event.city) &&
          event.tags.some((tag: string) => tagsRegex.test(tag))
      );
    } else {
      return events;
    }
  };

  const handleSearch = () => {
    const searchResult = filterEvents(searchText, searchLocation, searchTags);
    setSearchResults(searchResult);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSortOrder = e.target.value as 'recent' | 'tokens';
    setSortOrder(selectedSortOrder);

    let sortedResults = [...searchResults];
    if (selectedSortOrder === 'recent') {
      sortedResults.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
    } else if (selectedSortOrder === 'tokens') {
      sortedResults.sort((a, b) => b.token_bounty - a.token_bounty);
    }
    setSearchResults(sortedResults);
  };

  const {
    email,
  }: {
    email?: string | null;
  } = session?.user || {};

  useEffect(() => {
    async function fetchEvents() {
      if (!user) {
        setIsFetchingVolunteers(false);
      }
      if (user?.volunteerId) {
        setIsFetchingVolunteers(true);
      } else {
        setIsFetchingEvents(true);
      }
      // Query backend for events
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
          setSearchResults((formattedEvents as any) || []);
          return events;
        })
        .catch((error) => {
          console.error("Error fetching events: ", error);
        })
        .finally(() => {
          setIsFetchingEvents(false);
          setIsFetchingVolunteers(false);
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
    const startDateFormatted = `${startMonth} ${startDay < 10 ? "0" + startDay : startDay
      } ${startYear}`;

    // Format time range to display correctly and in local time.
    const formattedStartDate = new Date(startDate).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
    const formattedEndDate = new Date(endDate).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
    const timeRangeFormatted = `${formattedStartDate} - ${formattedEndDate}`;

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
      setIsApplying(true);
      const volunteerId = user.volunteerId;

      if (!volunteerId) {
        setIsApplying(false);
        console.error("Volunteer ID not found.");
        return;
      }

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
          router.push("/event?id=" + eventId);
        } else {
          console.error("Error adding attendee: ", res);
        }
      }).finally(() => setIsApplying(false));
    }
  }

  useEffect(() => {
    if (mapContainerRef.current) {
      const { width, height } = mapContainerRef.current.getBoundingClientRect();
      setMapDimensions({ width, height });
    }
  }, []);

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
    <div className="mt-12 mb-4 w-full">
      <SectionTitle
        title="Apply and make an impact today."
        pretitle="volunteer events"
        align="left"
      />

      {/* Search and Filter */}
      <Container>
        <div className="flex flex-col divide-y sm:flex-row sm:divide-x sm:divide-y-0 rounded-xl shadow-[0_6px_25px_rgb(0,0,0,0.08)]">
          <div className="flex h-[50px] w-full items-center rounded-s-xl px-2 pl-3">
            <LucideSearch size={20} color="#000000" />
            <input
              className="w-full appearance-none border-none bg-transparent placeholder-gray-400 focus:ring-0"
              type="text"
              placeholder="Search opportunities"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="flex h-[50px] w-full items-center px-2 pl-3">
            <LucideMapPin size={20} color="#000000" />
            <input
              className="w-full appearance-none border-none bg-transparent placeholder-gray-400 focus:ring-0"
              type="text"
              placeholder="Vancouver, BC"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          <div className="flex h-[50px] w-full items-center px-2">
            <input
              className="w-full appearance-none border-none bg-transparent placeholder-gray-400 focus:ring-0"
              type="text"
              placeholder="Filter Tags"
              value={searchTags}
              onChange={(e) => setSearchTags(e.target.value)}
            />
          </div>
          <div className="h-[50px] w-full sm:w-[125px] flex-none rounded-xl sm:rounded-e-xl bg-primary">
            <Link
              href="#"
              className="flex h-flex h-full w-full items-center justify-center sm:rounded-e-xl text-white"
              onClick={handleSearch}
            >
              Find Events
            </Link>
          </div>
        </div>
      </Container>

      {/* Info and Sort */}
      <Container className="flex items-center justify-between !py-0">
        <p className="text-xl font-semibold text-secondary">
          Showing <span id="numEvents">{searchResults.length}</span> events
        </p>
        <div className="flex items-center text-gray-400">
          <p>Sort by:</p>
          <select
            className="appearance-none border-none bg-transparent focus:ring-0"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="recent">Most Recent</option>
            <option value="tokens">Most Tokens</option>
          </select>
        </div>
      </Container>

      {/* Events (left) + Map (right) */}
      <Container className="flex gap-8">
        {isFetchingEvents ? (
          <div>
            <p className="animate-pulse text-[#858585] transition-all mb-4">
              Loading events...
            </p>
            <div className='flex space-x-2 justify-center items-center bg-white dark:invert'>
              <div className='h-4 w-4 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
              <div className='h-4 w-4 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
              <div className='h-4 w-4 bg-gray-300 rounded-full animate-bounce'></div>
            </div>
          </div>
        ) : (
          <>
            {/* Events List */}
            {/* Braden: added overflow-x-hidden to hide horizontal scrollbar */}
            <div className="max-h-[500px] flex-1 overflow-y-auto overflow-x-hidden">
              {/* Event Card */}
              {searchResults.length > 0 ? (
                searchResults.map((event, index) => (
                  <div
                    key={event.id}
                    id={`event-${index}`}
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
                          <Link className="text-lg font-semibold text-secondary hover:text-primary transition-all duration-300 ease-in-out" href={`/event?id=${event.id}`}>{event.name}</Link>
                          <p className="text-secondary opacity-80">
                            {(event as any).organization.name}
                          </p>
                          <p className="text-secondary opacity-80">
                            {event.city} - {event.end_time.toString()}
                          </p>
                        </div>
                      </div>
                      <Link href="#" className="">
                        <LucideHeart size={20} color="#cccccc" />
                      </Link>
                    </div>
                    <p className="mb-6 text-secondary opacity-80">{event.description}</p>
                    {/* Display number of volunteers and token bounty as two inline pills */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <LucideHeartHandshake size={20} className="text-secondary" />
                        <p className="text-gray-600">{event.event_volunteers.length}/{event.number_of_spots}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <LucideGem size={20} className="text-primary" />
                        <p className="text-gray-600">{event.token_bounty}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-between sm:flex-row">
                      <div className="flex items-center space-x-2 mt-2">
                        {event.tags.map((tag: string) => (
                          <span
                            key={event.id + tag}
                            className="inline-block rounded bg-primary bg-opacity-10 px-2.5 py-0.5 text-xs font-medium text-primary"
                          >
                            #&nbsp;{tag}
                          </span>
                        ))}
                      </div>
                      {/* Render spinner if fetching volunteers, otherwise apply button */}
                      {isFetchingVolunteers || isApplying ? (
                        <div className='flex space-x-2 justify-center items-center bg-white dark:invert'>
                          <div className='h-4 w-4 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                          <div className='h-4 w-4 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                          <div className='h-4 w-4 bg-gray-300 rounded-full animate-bounce'></div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => applyToEvent(event.id)}
                          className="!mr-0 rounded-lg bg-primary mt-4 w-full px-4 py-2 text-white sm:mt-0 sm:w-auto"
                          disabled={event.applied || event.event_volunteers.length >= event.number_of_spots}
                        >
                          {/* If user has already applied, show "Applied", if event is full, show "Full", otherwise, show Apply */}
                          {event.applied ? "Applied" : event.event_volunteers.length >= event.number_of_spots ? "Full" : "Apply"}
                        </Button>
                      )}

                    </div>
                  </div>
                ))
              ) : (
                <p>No events found.</p>
              )}
            </div>

            {/* Map Embed */}
            <div className="hidden flex-1 lg:block">
              <div
                className="overflow-hidden rounded-3xl ring-0"
                ref={mapContainerRef}
              >
                {isLoaded && (
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "500px", borderRadius: "1.5rem" }}
                    center={{ lat: 49.24, lng: -123.05 }}
                    zoom={10}
                    options={{
                      styles: [
                        {
                          "elementType": "geometry",
                          "stylers": [
                            {
                              "color": "#f5f5f5"
                            }
                          ]
                        },
                        {
                          "elementType": "labels.icon",
                          "stylers": [
                            {
                              "visibility": "off"
                            }
                          ]
                        },
                        {
                          "elementType": "labels.text.fill",
                          "stylers": [
                            {
                              "color": "#616161"
                            }
                          ]
                        },
                        {
                          "elementType": "labels.text.stroke",
                          "stylers": [
                            {
                              "color": "#f5f5f5"
                            }
                          ]
                        },
                        {
                          "featureType": "administrative.land_parcel",
                          "elementType": "labels.text.fill",
                          "stylers": [
                            {
                              "color": "#bdbdbd"
                            }
                          ]
                        },
                        {
                          "featureType": "poi",
                          "elementType": "geometry",
                          "stylers": [
                            {
                              "color": "#eeeeee"
                            }
                          ]
                        },
                        {
                          "featureType": "poi",
                          "elementType": "labels.text.fill",
                          "stylers": [
                            {
                              "color": "#757575"
                            }
                          ]
                        },
                        {
                          "featureType": "poi.park",
                          "elementType": "geometry",
                          "stylers": [
                            {
                              "color": "#e5e5e5"
                            }
                          ]
                        },
                        {
                          "featureType": "poi.park",
                          "elementType": "labels.text.fill",
                          "stylers": [
                            {
                              "color": "#9e9e9e"
                            }
                          ]
                        },
                        {
                          "featureType": "road",
                          "elementType": "geometry",
                          "stylers": [
                            {
                              "color": "#ffffff"
                            }
                          ]
                        },
                        {
                          "featureType": "road.arterial",
                          "elementType": "labels.text.fill",
                          "stylers": [
                            {
                              "color": "#757575"
                            }
                          ]
                        },
                        {
                          "featureType": "road.highway",
                          "elementType": "geometry",
                          "stylers": [
                            {
                              "color": "#dadada"
                            }
                          ]
                        },
                        {
                          "featureType": "road.highway",
                          "elementType": "labels.text.fill",
                          "stylers": [
                            {
                              "color": "#616161"
                            }
                          ]
                        },
                        {
                          "featureType": "road.local",
                          "elementType": "labels.text.fill",
                          "stylers": [
                            {
                              "color": "#9e9e9e"
                            }
                          ]
                        },
                        {
                          "featureType": "transit.line",
                          "elementType": "geometry",
                          "stylers": [
                            {
                              "color": "#e5e5e5"
                            }
                          ]
                        },
                        {
                          "featureType": "transit.station",
                          "elementType": "geometry",
                          "stylers": [
                            {
                              "color": "#eeeeee"
                            }
                          ]
                        },
                        {
                          "featureType": "water",
                          "elementType": "geometry",
                          "stylers": [
                            {
                              "color": "#c9c9c9"
                            }
                          ]
                        },
                        {
                          "featureType": "water",
                          "elementType": "labels.text.fill",
                          "stylers": [
                            {
                              "color": "#9e9e9e"
                            }
                          ]
                        }
                      ],
                      mapTypeControl: false,
                      streetViewControl: false,
                    }}
                  >
                    {markerCoordinates.map((coords, index) => (
                      coords[0] !== 0 && coords[1] !== 0 &&
                      <Marker
                        key={index}
                        position={{ lat: coords[0], lng: coords[1] }}
                        onClick={() => handleMarkerClick(index)}
                        icon={{
                          path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                          fillColor: '#ff5656',
                          fillOpacity: 1,
                          strokeColor: '#ff5656',
                          strokeWeight: 0,
                          scale: 0.7,
                        }}
                      />
                    ))}
                  </GoogleMap>
                )}
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
