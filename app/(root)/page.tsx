import prisma from "@/lib/prisma";
import Image from "next/image";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/shared/SectionTitle";

const Home = async () => {
  const events = await prisma.event.findMany();

  const faq_data = [
    {
      question: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, beatae?",
      answer: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt, cupiditate et eos laboriosam ipsum in modi voluptate corrupti quod iusto quia. Cupiditate numquam adipisci delectus."
    },
    {
      question: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, beatae?",
      answer: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt, cupiditate et eos laboriosam ipsum in modi voluptate corrupti quod iusto quia. Cupiditate numquam adipisci delectus."
    },
    {
      question: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, beatae?",
      answer: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt, cupiditate et eos laboriosam ipsum in modi voluptate corrupti quod iusto quia. Cupiditate numquam adipisci delectus."
    },
    {
      question: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, beatae?",
      answer: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt, cupiditate et eos laboriosam ipsum in modi voluptate corrupti quod iusto quia. Cupiditate numquam adipisci delectus."
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
            <p className="text-md font-bold tracking-widest text-teal-500 uppercase">Give a hand to make</p>
            <h1 className="py-1 pb-6 text-4xl font-bold leading-snug tracking-tight text-gray-800 md:text-6xl lg:leading-tight xl:text-8xl xl:leading-tight">the world better</h1>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <a href="#" className="px-8 py-4 text-sm font-medium text-center tracking-widest text-white bg-orange-600 rounded-2xl">VOLUNTEER NOW</a>
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
                <a href="#" className="px-8 py-4 text-sm font-medium text-center tracking-widest text-white bg-orange-600 rounded-2xl w-full">VOLUNTEER NOW</a>
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
                <a href="#" className="px-8 py-4 text-sm font-medium text-center tracking-widest text-white bg-orange-600 rounded-2xl w-full">VOLUNTEER NOW</a>
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
                <a href="#" className="px-8 py-4 text-sm font-medium text-center tracking-widest text-white bg-orange-600 rounded-2xl w-full">VOLUNTEER NOW</a>
              </div>
            </div>
          </>
        {/* )} */}
      </Container>

      {/* About */}
      <Container className="flex flex-wrap items-center !p-0 my-10">
        <div className="lg:w-1/2">
          <SectionTitle title="Together we can make a difference." pretitle="Our Mission" align="left">At KINDR, we believe in the power of individuals to create positive change. We empower socially conscious individuals through flexible and on-demand volunteering opportunities that fit seamlessly into busy lives. Join us in making a difference, one act of kindness at a time!</SectionTitle>
        </div>

        <div className="flex justify-center lg:w-1/2 xl:pl-20">
          <Image src="/landing-about.jpg" width="450" height="300" quality={100} className="rounded-2xl shadow-lg" alt="Landing Page About Image" />
        </div>
      </Container>

      {/* FAQ */}
      <SectionTitle title="Frequently Asked Questions" pretitle="FAQ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, ad saepe repellat itaque molestiae quo?</SectionTitle>
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
            A project by{" "}
            <a
              className="font-semibold text-gray-600 underline-offset-4 transition-colors hover:underline"
              href="https://github.com/jescalada"
              target="_blank"
              rel="noopener noreferrer"
            >
              BCIT Students
            </a>
          </p>
        </div>
      </Container>
    </>
  );
}

export default Home;