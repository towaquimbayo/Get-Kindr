// "use client"
// import { useSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import { randomInt } from "crypto";

const Home = async () => {
  // Define redirect for volunteer now button.
  let volunteerRedirect = "/events";

  // Set placeholder details for event 1.
  let event_1_name = "Rhythm of Life Society";
  let event_1_id = "123";
  let event_1_city = "Vancouver, BC";
  let event_1_date = "3"
  let event_1_year = "2024";
  let event_1_month = "Feb";
  let event_1_description = "Our Drum Run event is looking to add a Social Media Assistant for our high-energy team of ...";

  // Set placeholder details for event 2.
  let event_2_name = "Pinegrove Place";
  let event_2_id = "123";
  let event_2_city = "Burnaby, BC";
  let event_2_date = "12"
  let event_2_year = "2024";
  let event_2_month = "March";
  let event_2_description = "We are dedicated to promoting person-centered, holistic care in a manner ...";

  // Set placeholder details for event 3.
  let event_3_name = "SAHAS";
  let event_3_id = "123";
  let event_3_city = "Richmond, BC";
  let event_3_date = "21"
  let event_3_year = "2024";
  let event_3_month = "Feb";
  let event_3_description = "Helpline volunteers provide emotional support, information and resources, and effective ...";

  // Get all events from the database.
  const events = await prisma.event.findMany();

  // Randomly select 3 events to display on the landing page. If there are less than 3 events placeholders will be used.
  const randomEvents: any[] = [];
  if (events.length < 3) {
    while (randomEvents.length < 3) {
      const randomEvent = events[randomInt(0, events.length - 1)];
      // Check if the event is already in the list and if it is completed.
      if (!randomEvents.includes(randomEvent) && randomEvent.status != "COMPLETED") {
        randomEvents.push(randomEvent);
      }
    }
    let event_1 = randomEvents[0];
    event_1_name = event_1.name;
    event_1_id = event_1.id;
    event_1_city = event_1.city;
    event_1_date = new Date(event_1?.start_time).getDate().toString();
    event_1_year = new Date(event_1?.start_time).getFullYear().toString();
    event_1_month = new Date(event_1?.start_time).toLocaleString('default', { month: 'short' });
    event_1_description = event_1.description.length > 100 ? event_1.description.substring(0, 100) + "..." : event_1.description;

    // Get the details for event 2. Format date and truncate description if needed.
    let event_2 = randomEvents[1];
    event_2_name = event_2.name;
    event_2_id = event_2.id;
    event_2_city = event_2.city;
    event_2_date = new Date(event_2?.start_time).getDate().toString();
    event_2_year = new Date(event_2?.start_time).getFullYear().toString();
    event_2_month = new Date(event_2?.start_time).toLocaleString('default', { month: 'short' });
    event_2_description = event_2.description.length > 100 ? event_2.description.substring(0, 100) + "..." : event_2.description;

    // Get the details for event 3. Format date and truncate description if needed.
    let event_3 = randomEvents[2];
    event_3_name = event_3.name;
    event_3_id = event_3.id;
    event_3_city = event_3.city;
    event_3_date = new Date(event_3?.start_time).getDate().toString();
    event_3_year = new Date(event_3?.start_time).getFullYear().toString();
    event_3_month = new Date(event_3?.start_time).toLocaleString('default', { month: 'short' });
    event_3_description = event_3.description.length > 100 ? event_3.description.substring(0, 100) + "..." : event_3.description;
  }

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
      <div
        className="flex flex-col justify-center rounded-md bg-white p-8 shadow-lg"
      >
        <div className=" mt-6 text-2xl font-medium text-secondary leading-10">
          <span className="break-words">{eventName}</span>
        </div>
        <div className="flex flex-col justify-center mt-5 leading-8 text-secondary text-opacity-60 h-24">
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
            <p className="text-md font-bold uppercase tracking-widest text-tertiary brightness-90 drop-shadow-[0_0_2px_rgb(150,100,100)]">
              earn points with purpose
            </p>
            <h1 className="py-1 pb-6 font-display text-4xl text-secondary drop-shadow-[0_0_1px_rgb(100,100,100)] font-bold leading-snug tracking-tight text-gray-800 md:text-6xl lg:leading-tight xl:text-8xl xl:leading-tight">
              Spend with freedom.
            </h1>

            <div className="flex flex-col items-start space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <a
                href="/sign-up"
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

        <>
          <FeatureEvent
            eventId={event_1_id}
            eventName={event_1_name}
            description={event_1_description}
            location={event_1_city}
            date={event_1_month + " " + event_1_date + ", " + event_1_year}
          />
          <FeatureEvent
            eventId={event_2_id}
            eventName={event_2_name}
            description={event_2_description}
            location={event_2_city}
            date={event_2_month + " " + event_2_date + ", " + event_2_year}
          />
          <FeatureEvent
            eventId={event_3_id}
            eventName={event_3_name}
            description={event_3_description}
            location={event_3_city}
            date={event_3_month + " " + event_3_date + ", " + event_3_year}
          />
        </>
      </Container>

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
      <div id="faq" className="h-0 mb-10"></div>
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
              <h3 className="text-xl font-bold text-secondary">{faq.question}</h3>
              <p className="text-secondary opacity-80">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Footer */}
      <div className="w-full bg-orange-50">
        <Container>
          <div className="flex flex-col gap-4 justify-between sm:flex-row sm:gap-0">
            <div className="-ml-2 sm:-ml-0">
              <Image
                src="/get_KINDR_logo.png"
                width="110"
                height="10"
                quality={100}
                alt="Get Kindr Logo"
              />
            </div>
            <div className="flex gap-12 md:gap-30">
              <div className="flex flex-col">
                <p className="text-xs uppercase tracking-widest">Site Map</p>
                <div className="h-1"></div>
                <a
                  href="/"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  Home
                </a>
                <div className="h-0.5"></div>
                <a
                  href="#about"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  About
                </a>
                <div className="h-0.5"></div>
                <a
                  href="#faq"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  FAQ
                </a>
                <div className="h-0.5"></div>
                <a
                  href="/events"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  Events
                </a>
                <div className="h-0.5"></div>
                <a
                  href="/profile"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  Profile
                </a>
              </div>
              <div className="flex flex-col">
                <p className="text-xs uppercase tracking-widest">Follow Us</p>
                <div className="h-1"></div>
                <a
                  href="https://www.instagram.com/getkindr/"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  Instagram
                </a>
                <div className="h-2"></div>
                <a
                  href="https://www.tiktok.com/@getkindr"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  Tik Tok
                </a>
                <div className="h-2"></div>
                <a
                  href="https://www.linkedin.com/company/getkindr/about/"
                  className="text-gray-600 underline-offset-4 transition-colors hover:underline"
                >
                  LinkedIn
                </a>
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
};

export default Home;
