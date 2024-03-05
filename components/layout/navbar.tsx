"use client";

import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import UserDropdown from "./user-dropdown";
import { Session } from "next-auth";
import Container from "./Container";

export default function NavBar({ session }: { session: Session | null }) {
  const scrolled = useScroll(50);

  function NavLink({ href = "", name = "" }) {
    return (
      <Link
        href={href}
        className="hidden transition-all ease-in-out hover:text-primary sm:block"
      >
        {name}
      </Link>
    );
  }

  return (
    <nav
      className={`fixed top-0 flex w-full justify-center ${
        scrolled ? "bg-white/50 shadow-md backdrop-blur-xl" : "bg-white/0"
      } z-30 transition-all`}
    >
      <Container className="flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/kindr_logo.png"
            alt="KINDR logo"
            width="100"
            height="100"
            style={{ objectFit: "contain" }}
            className="mr-2"
          />
        </Link>
        <div className="flex items-center space-x-8">
          <NavLink href="/about" name="About" />
          <NavLink href="/events" name="Events" />
          <NavLink href="/add_event" name="Add Event" />
          <NavLink href="/edit_event" name="Edit Event (Hide)" />
          {session ? (
            <>
              <NavLink href="/profile" name="Profile" />
              <UserDropdown session={session} />
            </>
          ) : (
            <NavLink href="/login" name="Login" />
          )}
        </div>
      </Container>
    </nav>
  );
}
