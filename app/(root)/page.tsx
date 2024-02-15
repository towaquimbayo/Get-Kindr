import prisma from "@/lib/prisma";
import Image from "next/image";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/shared/SectionTitle";

const Home = async () => {
  const events = await prisma.event.findMany();

  const faq_data = [
    {
      question: "What is the best way to get started?",
      answer: "The best way to get started is to read the documentation. We have a quick start guide that will help you get up and running in no time."
    },
    {
      question: "What is the best way to get started?",
      answer: "The best way to get started is to read the documentation. We have a quick start guide that will help you get up and running in no time."
    },
    {
      question: "What is the best way to get started?",
      answer: "The best way to get started is to read the documentation. We have a quick start guide that will help you get up and running in no time."
    },
    {
      question: "What is the best way to get started?",
      answer: "The best way to get started is to read the documentation. We have a quick start guide that will help you get up and running in no time."
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
        {events.length > 0 ? (
          events.slice(0,3).map((event) => (
            <div key={event.id} className="flex flex-col h-full p-8 bg-white rounded-md shadow-lg">
              <div className="relative h-48">
                <Image src="/kindr_logo.png" layout="fill" objectFit="cover" objectPosition="left" quality={100} className="rounded-md" alt={event.name} />
              </div>
              <h2 className="py-4 text-2xl font-bold leading-snug tracking-tight text-gray-800">{event.name}</h2>
              <p className="text-gray-500">{event.description}</p>
            </div>
          ))
        ) : (
          <>
            <div key={123} className="flex flex-col h-full p-8 bg-white rounded-md shadow-lg">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&"
                className="w-10 rounded-xl aspect-square"
              />
              <div className="mt-6 text-2xl font-medium leading-10 whitespace-nowrap">
                Rhythm of Life Society
              </div>
              <div className="mt-5 leading-8 text-black text-opacity-60">
                Our Drum Run event is looking to add a Social Media Assistant
                for our high-energy team of ...
              </div>
              <div className="flex gap-5 justify-between mt-5 leading-[187.5%]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f151a4a7e813070c964f448b51bb41c1b1803f8ed36a5a9960a0a18311946b3d?apiKey=987aa06a0d974f4aa5948e6389c02cba&"
                  className="w-5 aspect-square"
                />
                <div className="flex-auto">Vancouver, BC</div>
              </div>
              <div className="flex gap-5 justify-between mt-4 leading-[187.5%]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/718eba12e95fb0a5cd867bd8c6d5f2a60e6dcff81cf78a28f4e1ef88cb9ff9d3?apiKey=987aa06a0d974f4aa5948e6389c02cba&"
                  className="w-5 aspect-square"
                />
                <div className="flex-auto">Feb 3, 2024</div>
              </div>
              <div className="flex flex-col items-start mt-5 sm:items-center sm:flex-row">
                <a href="#" className="px-8 py-4 text-sm font-medium text-center tracking-widest text-white bg-orange-600 rounded-2xl w-full">VOLUNTEER NOW</a>
              </div>
            </div>
            <div key={123} className="flex flex-col h-full p-8 bg-white rounded-md shadow-lg">
            <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&"
                className="w-10 rounded-xl aspect-square"
              />
              <div className="mt-6 text-2xl font-medium leading-10 whitespace-nowrap">
                Rhythm of Life Society
              </div>
              <div className="mt-5 leading-8 text-black text-opacity-60">
                Our Drum Run event is looking to add a Social Media Assistant
                for our high-energy team of ...
              </div>
              <div className="flex gap-5 justify-between mt-5 leading-[187.5%]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f151a4a7e813070c964f448b51bb41c1b1803f8ed36a5a9960a0a18311946b3d?apiKey=987aa06a0d974f4aa5948e6389c02cba&"
                  className="w-5 aspect-square"
                />
                <div className="flex-auto">Vancouver, BC</div>
              </div>
              <div className="flex gap-5 justify-between mt-4 leading-[187.5%]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/718eba12e95fb0a5cd867bd8c6d5f2a60e6dcff81cf78a28f4e1ef88cb9ff9d3?apiKey=987aa06a0d974f4aa5948e6389c02cba&"
                  className="w-5 aspect-square"
                />
                <div className="flex-auto">Feb 3, 2024</div>
              </div>
              <div className="flex flex-col items-start mt-5 sm:items-center sm:flex-row">
                <a href="#" className="px-8 py-4 text-sm font-medium text-center tracking-widest text-white bg-orange-600 rounded-2xl w-full">VOLUNTEER NOW</a>
              </div>
            </div>
            <div key={123} className="flex flex-col h-full p-8 bg-white rounded-md shadow-lg">
            <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4c663e8ef18f8af4bcda62a8c1f022f6bf6678ad6393435133eefe9e5b5770fc?apiKey=987aa06a0d974f4aa5948e6389c02cba&"
                className="w-10 rounded-xl aspect-square"
              />
              <div className="mt-6 text-2xl font-medium leading-10 whitespace-nowrap">
                Rhythm of Life Society
              </div>
              <div className="mt-5 leading-8 text-black text-opacity-60">
                Our Drum Run event is looking to add a Social Media Assistant
                for our high-energy team of ...
              </div>
              <div className="flex gap-5 justify-between mt-5 leading-[187.5%]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f151a4a7e813070c964f448b51bb41c1b1803f8ed36a5a9960a0a18311946b3d?apiKey=987aa06a0d974f4aa5948e6389c02cba&"
                  className="w-5 aspect-square"
                />
                <div className="flex-auto">Vancouver, BC</div>
              </div>
              <div className="flex gap-5 justify-between mt-4 leading-[187.5%]">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/718eba12e95fb0a5cd867bd8c6d5f2a60e6dcff81cf78a28f4e1ef88cb9ff9d3?apiKey=987aa06a0d974f4aa5948e6389c02cba&"
                  className="w-5 aspect-square"
                />
                <div className="flex-auto">Feb 3, 2024</div>
              </div>
              <div className="flex flex-col items-start mt-5 sm:items-center sm:flex-row">
                <a href="#" className="px-8 py-4 text-sm font-medium text-center tracking-widest text-white bg-orange-600 rounded-2xl w-full">VOLUNTEER NOW</a>
              </div>
            </div>
          </>
        )}
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
      {/* <SectionTitle title="Frequently Asked Questions" pretitle="FAQ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, ad saepe repellat itaque molestiae quo?</SectionTitle>
      <Container className="!p-0">
          <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
            {faq_data.map((faq, index) => (
              
            ))}
          </div>
      </Container> */}
      
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