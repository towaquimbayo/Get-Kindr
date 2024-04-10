"use client";

import { useEffect } from "react";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import UserDropdown from "./user-dropdown";
import Container from "./Container";

export default function NavBar({ session }: { session: Session | null }) {
  const scrolled = useScroll(50);

  function NavLink({ href = "", name = "" }) {
    const path = usePathname();
    const active = path === href;

    useEffect(() => {
      if (active) document.title = `Get Kindr - ${name}`;
    }, [active, name]);

    return (
      <Link
        href={href}
        className={`items-center transition-all duration-300 ease-in-out hover:opacity-50 ${session ? "hidden sm:block" : "block"} ${active ? "font-semibold text-primary" : "text-secondary"
          }`}
      >
        {name}
      </Link>
    );
  }

  return (
    <nav
      className={`fixed top-0 flex w-full justify-center ${scrolled ? "bg-white/50 shadow-md backdrop-blur-xl" : "bg-white/0"
        } z-30 transition-all`}
    >
      <Container className="flex items-center justify-between !py-4 px-4 sm:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/get_KINDR_logo.png"
            alt="Get KINDR logo"
            width="150"
            height="100"
            style={{ objectFit: "contain" }}
            className="mr-2"
          />
        </Link>
        <div className="flex items-center space-x-8">
          <NavLink href="/#about" name="About" />
          <NavLink href="/events" name="Events" />
          {session && session.accountType.toLowerCase() === "organization" && (
            <>
              <NavLink href="/my-events" name="My Events" />
              <NavLink href="/add_event" name="Add Event" />
              <NavLink href="/profile" name="Profile" />
              <UserDropdown session={session} />
            </>
          )}
          {session && session.accountType.toLowerCase() === "volunteer" && (
            <>
              <NavLink href="/my-events" name="My Events" />
              <NavLink href="/profile" name="Profile" />
              <UserDropdown session={session} />
            </>
          )}
          {!session && <NavLink href="/login" name="Login" />}
        </div>
      </Container>
    </nav>
  );
}
