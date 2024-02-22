import prisma from "@/lib/prisma";
import Image from "next/image";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/shared/SectionTitle";

const Home = async () => {
  const events = await prisma.event.findMany();

  const faq_data = [
    {
      question: "Why Kindr and why now?",
      answer: "In today's fast-paced world, many individuals must balance multiple jobs in a gig economy. Kindr emerges as a beacon of hope, offering the \"Ethical Side Hustle\" by rewarding volunteers for their time. This unique approach frees individuals up time to contribute to causes they care about despite economic pressures."
    },
    {
      question: "How do I get started as a volunteer?",
      answer: "Kickstart your journey with Kindr by completing your profile. The more details you provide, the better we can tailor volunteer opportunities to match your aspirations, location, and schedule. It's about making an impact where it counts, on your terms."
    },
    {
      question: "How do I get started as an organisation?",
      answer: "Organisations looking to harness the power of community can start by creating a profile on Kindr. Share your mission and needs; we'll connect you with passionate volunteers ready to make a difference. Your first step? Hosting a volunteer orientation session to welcome new faces to your cause."
    },
    {
      question: "How do I get started as a donor?",
      answer: "Your contributions are vital in driving change. By donating to Kindr, not only do you support meaningful causes, but you also gain visibility into the impact of your generosity. Stay tuned for opportunities to contribute your time, and contact support@getkindr.com for more details."
    },
    {
      question: "How do I get started as a sponsor?",
      answer: "Sponsors play a crucial role in amplifying our impact. By partnering with Kindr, you help fuel our mission and extend your brand's reach to a community dedicated to positive change. Contact us at support@getkindr.com to explore sponsorship opportunities and how your organisation can contribute to our ecosystem of kindness."
    },
    {
      question: "What can I do with the Kindness Points that I earn?",
      answer: "The possibilities with Kindness Points are ever-expanding. From redeeming points for discounts and rewards from our partners to converting them into cash, your early involvement ensures a richer rewards experience as our community grows."
    },
    {
      question: "How can I find out if my charity is on Kindr? What if it's not?",
      answer: "Please browse through our list of participating organisations. If your charity needs to be listed, let them know about the opportunities Kindr offers, or contact us at support@getkindr.com. Your referrals not only expand our community but also earn you Kindness Points."
    },
    {
      question: "Why use Kindr instead of traditional volunteering methods?",
      answer: "While word-of-mouth has charm, Kindr broadens your horizon by making it easier to discover volunteering opportunities that might otherwise go unnoticed. Also, earning Kindness Points adds an extra reward to your altruistic efforts. Refer friends to amplify your impact and rewards."
    },
  ];

  return (
    <>
      {/* Hero */}
      <Container className="flex h-screen">
        <Image src="/landing-hero.png" layout="fill" objectFit="cover" objectPosition="center" quality={100} className="z-0" alt="Landing Page Hero Image" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200 opacity-90 to-transparent z-10"></div>
        <div className="flex items-end w-full z-20">
          <div className="max-w-xl mb-16">
            <p className="text-md font-bold tracking-widest text-teal-500 uppercase">earn points with purpose</p>
            <h1 className="py-1 pb-6 text-4xl font-display font-bold leading-snug tracking-tight text-gray-800 md:text-6xl lg:leading-tight xl:text-8xl xl:leading-tight">spend with freedom</h1>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <a href="#" className="px-8 py-4 text-sm font-medium text-center tracking-widest text-white bg-primary rounded-2xl uppercase">join us today</a>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Featured Events */}
      <SectionTitle title="Volunteer and touch the lives of many." pretitle="Featured Events" align="left" />
      <Container className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* {events.length > 0 ? (
          events.slice(0,3).map((event) => (
            <div key={event.id} className="flex flex-col h-full p-8 bg-white rounded-md shadow-lg">
              <div className="relative h-48">
                <Image src="/kindr_logo.png" layout="fill" objectFit="cover" objectPosition="left" quality={100} className="rounded-md" alt={event.name} />
              </div>
              <h2 className="py-4 text-2xl font-bold leading-snug tracking-tight text-gray-800">{event.name}</h2>
              <p className="text-gray-500">{event.description}</p>
            </div>
          ))
        ) : ( */}
          <>
            <div key={123} className="flex flex-col h-full p-8 bg-white rounded-md shadow-lg">
              <Image src="/placeholder_image.svg" width="40" height="40" quality={100} className="rounded-lg opacity-40 bg-gray-200 p-2" alt="Placeholder Image" />
              <div className="mt-6 text-2xl font-medium leading-10 whitespace-nowrap">
                Rhythm of Life Society
              </div>
              <div className="mt-5 leading-8 text-black text-opacity-60">
                Our Drum Run event is looking to add a Social Media Assistant
                for our high-energy team of ...
              </div>
              <div className="flex gap-5 justify-between mt-5 leading-[187.5%]">
                <Image src="/location.svg" width="20" height="20" quality={100} alt="Location Icon" />
                <div className="flex-auto">Vancouver, BC</div>
              </div>
              <div className="flex gap-5 justify-between mt-4 leading-[187.5%]">
                <Image src="/calendar.svg" width="20" height="20" quality={100} alt="Calendar Icon" />
                <div className="flex-auto">Feb 3, 2024</div>
              </div>
              <div className="flex flex-col items-start mt-5 sm:items-center sm:flex-row">
                <a href="#" className="px-8 py-4 text-sm font-medium text-center tracking-widest text-white bg-primary rounded-2xl w-full">VOLUNTEER NOW</a>
              </div>
            </div>
            <div key={123} className="flex flex-col h-full p-8 bg-white rounded-md shadow-lg">
              <Image src="/placeholder_image.svg" width="40" height="40" quality={100} className="rounded-lg opacity-40 bg-gray-200 p-2" alt="Placeholder Image" />
              <div className="mt-6 text-2xl font-medium leading-10 whitespace-nowrap">
                SAHAS
              </div>
              <div className="mt-5 leading-8 text-black text-opacity-60">
                Helpline volunteers provide emotional support, information and resources, and effective ...
              </div>
              <div className="flex gap-5 justify-between mt-5 leading-[187.5%]">
                <Image src="/location.svg" width="20" height="20" quality={100} alt="Location Icon" />
                <div className="flex-auto">Richmond, BC</div>
              </div>
              <div className="flex gap-5 justify-between mt-4 leading-[187.5%]">
                <Image src="/calendar.svg" width="20" height="20" quality={100} alt="Calendar Icon" />
                <div className="flex-auto">Feb 21, 2024</div>
              </div>
              <div className="flex flex-col items-start mt-5 sm:items-center sm:flex-row">
                <a href="#" className="px-8 py-4 text-sm font-medium text-center tracking-widest text-white bg-primary rounded-2xl w-full">VOLUNTEER NOW</a>
              </div>
            </div>
            <div key={123} className="flex flex-col h-full p-8 bg-white rounded-md shadow-lg">
              <Image src="/placeholder_image.svg" width="40" height="40" quality={100} className="rounded-lg opacity-40 bg-gray-200 p-2" alt="Placeholder Image" />
              <div className="mt-6 text-2xl font-medium leading-10 whitespace-nowrap">
                Pinegrove Place
              </div>
              <div className="mt-5 leading-8 text-black text-opacity-60">
                We are dedicated to promoting person-centered, holistic care in a manner ...
              </div>
              <div className="flex gap-5 justify-between mt-5 leading-[187.5%]">
                <Image src="/location.svg" width="20" height="20" quality={100} alt="Location Icon" />
                <div className="flex-auto">Burnaby, BC</div>
              </div>
              <div className="flex gap-5 justify-between mt-4 leading-[187.5%]">
                <Image src="/calendar.svg" width="20" height="20" quality={100} alt="Calendar Icon" />
                <div className="flex-auto">March 12, 2024</div>
              </div>
              <div className="flex flex-col items-start mt-5 sm:items-center sm:flex-row">
                <a href="#" className="px-8 py-4 text-sm font-medium text-center tracking-widest text-white bg-primary rounded-2xl w-full">VOLUNTEER NOW</a>
              </div>
            </div>
          </>
        {/* )} */}
      </Container>

      {/* About */}
      <Container className="flex flex-wrap items-center !p-0 my-10">
        <div className="lg:w-1/2">
          <SectionTitle title="Together we can make a difference." pretitle="Why Kindr" align="left">KINDR is not just a rewards program; it's a movement towards creating a more empathetic and supportive world. By connecting volunteers, charities, sponsors, and donors in a seamless ecosystem, KINDR empowers every participant to make impactful choices. It's an invitation to live a life of purpose, enjoy the freedom of meaningful rewards, and be part of a community that values actions that make a difference.</SectionTitle>
        </div>

        <div className="flex justify-center lg:w-1/2 xl:pl-20">
          <Image src="/landing-about.jpg" width="450" height="300" quality={100} className="rounded-2xl shadow-lg" alt="Landing Page About Image" />
        </div>
      </Container>

      {/* FAQ */}
      <SectionTitle title="Frequently Asked Questions" pretitle="FAQ">KINDR redefines the concept of rewards by intertwining the spirit of volunteerism with the benefits of a loyalty program. As a platform that celebrates and incentivises acts of kindness, KINDR offers individuals, charities, sponsors, and donors a unique opportunity to engage in meaningful actions that benefit society.</SectionTitle>
      <Container>
        <div className="grid gap-10 md:gap-8 sm:p-3 md:grid-cols-2 lg:px-12 xl:px-32">
          {faq_data.map((faq, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-bold">{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </Container>
      
      {/* Footer */}
      <Container className="">
        <div className="text-center">
          <p className="text-gray-500">
            &copy; 2024{" "}
            <a
              className="font-semibold text-gray-600 underline-offset-4 transition-colors hover:underline"
              href="https://getkindr.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              KINDR
            </a>
          </p>
        </div>
      </Container>
    </>
  );
}

export default Home;