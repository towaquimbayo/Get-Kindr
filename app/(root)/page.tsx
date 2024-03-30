"use client";
import { useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import { randomInt } from "crypto";

const Home = async () => {
  const { data: session } = useSession();
  let volunteerRedirect = "/events";
  if (!session) {
    volunteerRedirect = "/login";
  }

  const events = await prisma.event.findMany();

  const randomEvents: any[] = [];
  while (randomEvents.length < 3) {
    const randomEvent = events[randomInt(0, events.length - 1)];
    if (!randomEvents.includes(randomEvent) && randomEvent.status != "COMPLETED") {
      randomEvents.push(randomEvent);
    }
  }

  let event_1 = randomEvents[0];
  let event_1_date = new Date(event_1.start_time);
  let event_1_month = event_1_date.toLocaleString('default', { month: 'short' });
  let event_1_description = event_1.description.length > 100 ? event_1.description.substring(0, 100) + "..." : event_1.description;

  let event_2 = randomEvents[1];
  let event_2_date = new Date(event_2.start_time);
  let event_2_month = event_2_date.toLocaleString('default', { month: 'short' });
  let event_2_description = event_2.description.length > 100 ? event_2.description.substring(0, 100) + "..." : event_2.description;

  let event_3 = randomEvents[2];
  let event_3_date = new Date(event_3.start_time);
  let event_3_month = event_3_date.toLocaleString('default', { month: 'short' });
  let event_3_description = event_3.description.length > 100 ? event_3.description.substring(0, 100) + "..." : event_3.description;

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
      question: "How do I get started as an organisation?",
      answer:
        "Organisations looking to harness the power of community can start by creating a profile on Kindr. Share your mission and needs; we'll connect you with passionate volunteers ready to make a difference. Your first step? Hosting a volunteer orientation session to welcome new faces to your cause.",
    },
    {
      question: "How do I get started as a donor?",
      answer:
        "Your contributions are vital in driving change. By donating to Kindr, not only do you support meaningful causes, but you also gain visibility into the impact of your generosity. Stay tuned for opportunities to contribute your time, and contact support@getkindr.com for more details.",
    },
    {
      question: "How do I get started as a sponsor?",
      answer:
        "Sponsors play a crucial role in amplifying our impact. By partnering with Kindr, you help fuel our mission and extend your brand's reach to a community dedicated to positive change. Contact us at support@getkindr.com to explore sponsorship opportunities and how your organisation can contribute to our ecosystem of kindness.",
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
        "Please browse through our list of participating organisations. If your charity needs to be listed, let them know about the opportunities Kindr offers, or contact us at support@getkindr.com. Your referrals not only expand our community but also earn you Kindness Points.",
    },
    {
      question: "Why use Kindr instead of traditional volunteering methods?",
      answer:
        "While word-of-mouth has charm, Kindr broadens your horizon by making it easier to discover volunteering opportunities that might otherwise go unnoticed. Also, earning Kindness Points adds an extra reward to your altruistic efforts. Refer friends to amplify your impact and rewards.",
    },
  ];

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
      <div
        className="flex flex-col justify-center rounded-md bg-white p-8 shadow-lg"
      >
        <div className=" mt-6 text-2xl font-medium leading-10">
          <span className="break-words">{eventName}</span>
        </div>
        <div className="flex flex-col justify-center mt-5 leading-8 text-black text-opacity-60 h-24">
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
          <div className="flex-auto">{location}</div>
        </div>
        <div className="my-4 flex justify-between gap-5 leading-[187.5%]">
          <Image
            src="/calendar.svg"
            width="20"
            height="20"
            quality={100}
            alt="Calendar Icon"
          />
          <div className="flex-auto">{date}</div>
        </div>
        <div className="relative mt-auto flex flex-col items-start sm:flex-row sm:items-center">
          <a
            href={volunteerRedirect}
            className="w-full rounded-2xl bg-primary px-8 py-4 text-center text-sm font-medium tracking-widest text-white mt-4"
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
            <p className="text-md font-bold uppercase tracking-widest text-teal-500 drop-shadow-[0_0_3px_rgb(255,255,255)]">
              earn points with purpose
            </p>
            <h1 className="py-1 pb-6 font-display text-4xl font-bold leading-snug tracking-tight text-gray-800 md:text-6xl lg:leading-tight xl:text-8xl xl:leading-tight">
              Spend with freedom.
            </h1>

            <div className="flex flex-col items-start space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <a
                href="#"
                className="rounded-2xl bg-primary px-8 py-4 text-center text-sm font-medium uppercase tracking-widest text-white"
              >
                join us today
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Featured Events */}
      <SectionTitle
        title="Volunteer and touch the lives of many."
        pretitle="Featured Events"
        align="left"
      />
      <Container className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {events.length < 3 ? (
          <>
            <FeatureEvent
              eventId="123"
              eventName="Rhythm of Life Society"
              description="Our Drum Run event is looking to add a Social Media Assistant for our high-energy team of ..."
              location="Vancouver, BC"
              date="Feb 3, 2024"
            />
            <FeatureEvent
              eventId="123"
              eventName="SAHAS"
              description="Helpline volunteers provide emotional support, information and resources, and effective ..."
              location="Richmond, BC"
              date="Feb 21, 2024"
            />
            <FeatureEvent
              eventId="123"
              eventName="Pinegrove Place"
              description="We are dedicated to promoting person-centered, holistic care in a manner ..."
              location="Burnaby, BC"
              date="March 12, 2024"
            />
          </>
        ) : (
          <>
            <FeatureEvent
              eventId={event_1.id}
              eventName={event_1.name}
              description={event_1_description}
              location={event_1.city}
              date={event_1_month + " " + event_1_date.getDate() + ", " + event_1_date.getFullYear()}
            />
            <FeatureEvent
              eventId={event_2.id}
              eventName={event_2.name}
              description={event_2_description}
              location={event_2.city}
              date={event_2_month + " " + event_2_date.getDate() + ", " + event_2_date.getFullYear()}
            />
            <FeatureEvent
              eventId={event_3.id}
              eventName={event_3.name}
              description={event_3_description}
              location={event_3.city}
              date={event_3_month + " " + event_3_date.getDate() + ", " + event_3_date.getFullYear()}
            />
          </>
        )}
      </Container>

      {/* About */}
      <Container className="my-10 flex flex-wrap items-center !p-0">
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
              <h3 className="text-xl font-bold">{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Footer */}
      <div className="w-full bg-orange-50">
        <Container className="">
          <div>
            <div className="flex justify-between">
              <div className="">
                <Image
                  src="/kindr_logo.png"
                  width="110"
                  height="10"
                  quality={100}
                  alt="Kindr Logo"
                />
              </div>
              <div className="flex gap-30">
                <div className="flex flex-col">
                  <p className="text-xs uppercase tracking-widest">Site Map</p>
                  <a
                    href="https://getkindr.com/"
                    className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                  >
                    Home
                  </a>
                  <a
                    href="https://getkindr.com/events"
                    className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                  >
                    Events
                  </a>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs uppercase tracking-widest">Email</p>
                  <a
                    href="#"
                    className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                  >
                    support@getkindr.com
                  </a>
                  <p className="mt-3 text-xs uppercase tracking-widest">
                    Phone
                  </p>
                  <a
                    href="#"
                    className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                  >
                    (604) 123-4567
                  </a>
                </div>
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
              . All rights reserved. Last Updated: 2024-03-26 12:28:22
            </p>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Home;
