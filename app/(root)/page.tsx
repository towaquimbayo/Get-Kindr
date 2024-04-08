"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);

  // Define redirect for volunteer now button.
  let volunteerRedirect = "/events";

  // Get all events from the database.
  useEffect(() => {
    async function fetchEvents() {
      await fetch("/api/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          const fetchedEvents = await res.json();
          if (!fetchedEvents) {
            console.error("No events found", fetchedEvents);
            return;
          }
          console.log("Fetched Events:", fetchedEvents);

          // get 3 random events
          const featuredEvents: any[] = [];
          while (featuredEvents.length < 3) {
            const randomEvent =
              fetchedEvents[Math.floor(Math.random() * fetchedEvents.length)];
            // Check if the event is already in the list and if it is completed.
            if (
              featuredEvents.filter((e) => e.id === randomEvent.id).length ===
                0 &&
              randomEvent.status != "COMPLETED"
            ) {
              featuredEvents.push({
                id: randomEvent.id,
                name: randomEvent.name,
                description:
                  randomEvent.description.length > 100
                    ? randomEvent.description.substring(0, 100) + "..."
                    : randomEvent.description,
                city: randomEvent.city,
                start_time:
                  new Date(randomEvent?.start_time).toLocaleString("default", {
                    month: "short",
                  }) +
                  " " +
                  new Date(randomEvent?.start_time).getDate() +
                  ", " +
                  new Date(randomEvent?.start_time).getFullYear(),
              });
            }
          }
          console.log("FEATURED: ", featuredEvents);
          setEvents(featuredEvents as never[]);
        })
        .catch((error) => {
          console.error("Error finding event: ", error);
        });
    }
    fetchEvents();
  }, []);

  const faq_data = [
    {
      question: "Why Kindr and why now?",
      answer:
        'In today\'s fast-paced world, many individuals must balance multiple jobs in a gig economy. Kindr emerges as a beacon of hope, offering the "Ethical Side Hustle" by rewarding volunteers for their time. This unique approach frees individuals up time to contribute to causes they care about despite economic pressures.',
    },
    {
      question: "How do I get started as a volunteer?",
      answer:
        "Kickstart your journey with Kindr by completing your profile. The more details you provide, the better we can tailor volunteer opportunities to match your aspirations, location, and schedule. It's about making an impact where it counts, on your terms.",
    },
    {
      question: "How do I get started as an organization?",
      answer:
        "Organizations looking to harness the power of community can start by creating a profile on Kindr. Share your mission and needs; we'll connect you with passionate volunteers ready to make a difference. Your first step? Hosting a volunteer orientation session to welcome new faces to your cause.",
    },
    {
      question: "How do I get started as a donor?",
      answer:
        "Your contributions are vital in driving change. By donating to Kindr, not only do you support meaningful causes, but you also gain visibility into the impact of your generosity. Stay tuned for opportunities to contribute your time, and contact hello@getkindr.comm for more details.",
    },
    {
      question: "How do I get started as a sponsor?",
      answer:
        "Sponsors play a crucial role in amplifying our impact. By partnering with Kindr, you help fuel our mission and extend your brand's reach to a community dedicated to positive change. Contact us at hello@getkindr.com to explore sponsorship opportunities and how your organization can contribute to our ecosystem of kindness.",
    },
    {
      question: "What can I do with the Kindness Points that I earn?",
      answer:
        "The possibilities with Kindness Points are ever-expanding. From redeeming points for discounts and rewards from our partners to converting them into cash, your early involvement ensures a richer rewards experience as our community grows.",
    },
    {
      question:
        "How can I find out if my charity is on Kindr? What if it's not?",
      answer:
        "Please browse through our list of participating organizations. If your charity needs to be listed, let them know about the opportunities Kindr offers, or contact us at hello@getkindr.com. Your referrals not only expand our community but also earn you Kindness Points.",
    },
    {
      question: "Why use Kindr instead of traditional volunteering methods?",
      answer:
        "While word-of-mouth has charm, Kindr broadens your horizon by making it easier to discover volunteering opportunities that might otherwise go unnoticed. Also, earning Kindness Points adds an extra reward to your altruistic efforts. Refer friends to amplify your impact and rewards.",
    },
  ];

  // Define the FeatureEvent component for display.
  function FeatureEvent({
    eventId,
    eventName,
    description,
    location,
    date,
  }: {
    eventId: string;
    eventName: string;
    description: string;
    location: string;
    date: string;
  }) {
    return (
      <div className="flex flex-col justify-center rounded-md bg-white p-8 shadow-lg">
        <div className=" mt-6 text-2xl font-medium leading-10 text-secondary">
          <span className="break-words">{eventName}</span>
        </div>
        <div className="mt-5 flex h-24 flex-col justify-center leading-8 text-secondary text-opacity-60">
          {description}
        </div>
        <div className="mt-5 flex justify-between gap-5 leading-[187.5%]">
          <Image
            src="/location.svg"
            width="20"
            height="20"
            quality={100}
            alt="Location Icon"
          />
          <div className="flex-auto text-secondary">{location}</div>
        </div>
        <div className="my-4 flex justify-between gap-5 leading-[187.5%]">
          <Image
            src="/calendar.svg"
            width="20"
            height="20"
            quality={100}
            alt="Calendar Icon"
          />
          <div className="flex-auto text-secondary">{date}</div>
        </div>
        <div className="relative mt-auto flex flex-col items-start sm:flex-row sm:items-center">
          <a
            href={volunteerRedirect}
            className="mt-4 w-full rounded-2xl bg-primary px-8 py-4 text-center text-sm font-medium tracking-widest text-white"
          >
            VOLUNTEER NOW
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <Container className="flex h-screen">
        <Image
          src="/landing-hero.png"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          quality={100}
          className="z-0"
          alt="Landing Page Hero Image"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-orange-200 to-transparent opacity-90"></div>
        <div className="z-20 flex w-full items-end">
          <div className="mb-16 max-w-xl">
            <p className="text-md font-bold uppercase tracking-widest text-tertiary brightness-90 drop-shadow-[0_0_2px_rgb(150,100,100)]">
              earn points with purpose
            </p>
            <h1 className="py-1 pb-6 font-display text-4xl font-bold leading-snug tracking-tight text-secondary drop-shadow-[0_0_1px_rgb(100,100,100)] md:text-6xl lg:leading-tight xl:text-8xl xl:leading-tight">
              Spend with freedom.
            </h1>

            <div className="flex flex-col items-start space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <a
                href={session ? "/events" : "/sign-up"}
                className="rounded-2xl bg-primary px-8 py-4 text-center text-sm font-medium uppercase tracking-widest text-white"
              >
                join us today
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Featured Events */}
      {events.length >= 3 && (
        <>
          <SectionTitle
            title="Volunteer and touch the lives of many."
            pretitle="Featured Events"
            align="left"
          />
          <Container className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map(
              (
                event: {
                  id: string;
                  name: string;
                  description: string;
                  city: string;
                  start_time: string;
                },
                index: number,
              ) => (
                <FeatureEvent
                  key={index}
                  eventId={event.id}
                  eventName={event.name}
                  description={
                    event.description.length > 100
                      ? event.description.substring(0, 100) + "..."
                      : event.description
                  }
                  location={event.city}
                  date={
                    new Date(event?.start_time).toLocaleString("default", {
                      month: "short",
                    }) +
                    " " +
                    new Date(event?.start_time).getDate() +
                    ", " +
                    new Date(event?.start_time).getFullYear()
                  }
                />
              ),
            )}
          </Container>
        </>
      )}

      {/* About */}
      <div id="about" className="h-0"></div>
      <Container className="mt-10 flex flex-wrap items-center !p-0">
        <div className="lg:w-1/2">
          <SectionTitle
            title="Together we can make a difference."
            pretitle="Why Kindr"
            align="left"
          >
            KINDR is not just a rewards program; it&apos;s a movement towards
            creating a more empathetic and supportive world. By connecting
            volunteers, charities, sponsors, and donors in a seamless ecosystem,
            KINDR empowers every participant to make impactful choices.
            It&apos;s an invitation to live a life of purpose, enjoy the freedom
            of meaningful rewards, and be part of a community that values
            actions that make a difference.
          </SectionTitle>
        </div>

        <div className="flex justify-center lg:w-1/2 xl:pl-20">
          <Image
            src="/landing-about.jpg"
            width="450"
            height="300"
            quality={100}
            className="rounded-2xl shadow-lg"
            alt="Landing Page About Image"
          />
        </div>
      </Container>
      <div id="faq" className="mb-10 h-0"></div>
      {/* FAQ */}
      <SectionTitle title="Frequently Asked Questions" pretitle="FAQ">
        KINDR redefines the concept of rewards by intertwining the spirit of
        volunteerism with the benefits of a loyalty program. As a platform that
        celebrates and incentivises acts of kindness, KINDR offers individuals,
        charities, sponsors, and donors a unique opportunity to engage in
        meaningful actions that benefit society.
      </SectionTitle>
      <Container>
        <div className="grid gap-10 sm:p-3 md:grid-cols-2 md:gap-8 lg:px-12 xl:px-32">
          {faq_data.map((faq, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-bold text-secondary">
                {faq.question}
              </h3>
              <p className="text-secondary opacity-80">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Footer */}
      <div className="w-full bg-orange-50">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:gap-0">
            <div className="-ml-2 mr-16 sm:-ml-0 lg:ml-6 lg:mr-0">
              <Image
                src="/get_KINDR_logo.png"
                width="150"
                height="100"
                quality={100}
                alt="Get Kindr Logo"
              />
            </div>
            <div className="flex flex-col gap-8 md:flex-row md:gap-30">
              <div className="flex flex-col space-y-1">
                <p className="text-xs uppercase tracking-widest">Site Map</p>
                <a
                  href="/"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  About
                </a>
                <a
                  href="#faq"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  FAQ
                </a>
                <a
                  href="/events"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  Events
                </a>
                <a
                  href="/profile"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  Profile
                </a>
              </div>
              <div className="flex flex-col">
                <p className="text-xs uppercase tracking-widest">Follow Us</p>
                <div className="-ml-2 flex flex-row items-start">
                  <a
                    href="https://www.instagram.com/getkindr/"
                    className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      fill="#455A7C"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                    >
                      <path d="M 8 3 C 5.239 3 3 5.239 3 8 L 3 16 C 3 18.761 5.239 21 8 21 L 16 21 C 18.761 21 21 18.761 21 16 L 21 8 C 21 5.239 18.761 3 16 3 L 8 3 z M 18 5 C 18.552 5 19 5.448 19 6 C 19 6.552 18.552 7 18 7 C 17.448 7 17 6.552 17 6 C 17 5.448 17.448 5 18 5 z M 12 7 C 14.761 7 17 9.239 17 12 C 17 14.761 14.761 17 12 17 C 9.239 17 7 14.761 7 12 C 7 9.239 9.239 7 12 7 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z"></path>
                    </svg>
                  </a>
                  <a
                    href="https://www.tiktok.com/@getkindr"
                    className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      fill="#455A7C"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                    >
                      <path d="M 6 3 C 4.3550302 3 3 4.3550302 3 6 L 3 18 C 3 19.64497 4.3550302 21 6 21 L 18 21 C 19.64497 21 21 19.64497 21 18 L 21 6 C 21 4.3550302 19.64497 3 18 3 L 6 3 z M 12 7 L 14 7 C 14 8.005 15.471 9 16 9 L 16 11 C 15.395 11 14.668 10.734156 14 10.285156 L 14 14 C 14 15.654 12.654 17 11 17 C 9.346 17 8 15.654 8 14 C 8 12.346 9.346 11 11 11 L 11 13 C 10.448 13 10 13.449 10 14 C 10 14.551 10.448 15 11 15 C 11.552 15 12 14.551 12 14 L 12 7 z"></path>
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/getkindr/about/"
                    className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      fill="#455A7C"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9 V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977 C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-xs uppercase tracking-widest">Email</p>
                <a
                  href="mailto:hello@getkindr.com"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  hello@getkindr.com
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 flex">
            <p className="text-gray-500">
              Copyright &copy; 2024{" "}
              <a
                className="font-semibold text-gray-600 underline-offset-4 transition-colors hover:underline"
                href="https://getkindr.com/"
                rel="noopener noreferrer"
              >
                KINDR
              </a>
              . All rights reserved.
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}
