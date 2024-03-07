import Container from "@/components/layout/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import { LucideSearch, LucideMapPin } from "lucide-react";
import Link from "next/link";

export default function Events() {
  return (
    <>
      <SectionTitle title="Apply and make an impact today." pretitle="volunteer events" align="left" />

      {/* Search and Filter */}
      <Container>
        <div className="h-[50px] rounded-xl flex divide-x shadow-[0_6px_25px_rgb(0,0,0,0.08)]">
          <div className="size-full px-2 pl-3 rounded-s-xl flex items-center">
            <LucideSearch size={20} color="#ff5656" />
            <input className="w-full appearance-none bg-transparent border-none placeholder-gray-400 focus:ring-0" type="text" placeholder="Search opportunities" />
          </div>
          <div className="size-full px-2 pl-3 flex items-center">
            <LucideMapPin size={20} color="#ff5656" />
            <input className="w-full appearance-none bg-transparent border-none placeholder-gray-400 focus:ring-0" type="text" placeholder="Vancouver, BC" />
          </div>
          <div className="size-full px-2 flex items-center">
            <input className="w-full appearance-none bg-transparent border-none placeholder-gray-400 focus:ring-0" type="text" placeholder="Filter Tags" />
          </div>
          <div className="flex-none w-[125px] h-full bg-primary rounded-e-xl">
            <Link href="#" className="size-full text-white flex items-center justify-center rounded-e-xl">Find Events</Link>
          </div>
        </div>
      </Container>
    </>
  );
}
