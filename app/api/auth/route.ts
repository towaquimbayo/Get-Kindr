import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// find all Events where user is a volunteer by volunteer id
async function getVolunteerHours(volunteerId: string) {
  return prisma.eventVolunteer.findMany({
    where: {
      volunteerId,
    },
    select: {
      event: {
        select: {
          start_time: true,
          end_time: true,
        },
      },
    },
  }).then((events) => {
    let totalHours = 0;
    events.forEach((event) => {
      const startTime = new Date(event.event.start_time);
      const endTime = new Date(event.event.end_time);
      totalHours += (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    });
    return totalHours;
  }).catch((error) => {
    console.error("Error fetching volunteer hours: ", error);
    return 0;
  });
}

// find all Events where user is an organization by organization id
async function getOrgHostedEvents(organizationId: string) {
  return prisma.event.findMany({
    where: {
      organization_id: organizationId,
    },
    select: {
      id: true,
    },
  }).then((events) => {
    return events.length;
  }).catch((error) => {
    console.error("Error fetching org hosted events: ", error);
    return 0;
  });

}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userEmail = decodeURIComponent(url.searchParams.get("email") || "");
    console.log("Fetching user for email: ", userEmail);

    if (!userEmail) {
      console.error("Email was not provided in the request.");
      return NextResponse.json(
        { message: "Email cannot be empty." },
        { status: 404 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        organization: true,
        volunteer: true,
      },
    });

    if (!user) {
      console.error("User not found for email: ", userEmail);
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    console.log("Successfully fetched user: ", user);

    const isOrganization = user.accountType?.toLowerCase() === "organization";
    const volunteerHours = isOrganization ? 0 : await getVolunteerHours(user.volunteer?.id || "");
    const orgHostedEvents = isOrganization ? await getOrgHostedEvents(user.organization?.id || "") : 0;

    return NextResponse.json({
      status: 200,
      user: {
        firstName: isOrganization ? "" : user.name?.split(" ")[0],
        lastName: isOrganization ? "" : user.name?.split(" ")[1],
        organizationName: isOrganization ? user.name : "",
        email: user.email,
        phone: user.phoneNumber,
        password: "",
        organizationId: user.organization?.id,
        volunteerId: user.volunteer?.id,
        tokenBalance: user.tokenBalance || 0,
        volunteerHours: volunteerHours,
        orgHostedEvents: orgHostedEvents,
      },
    });
  } catch (e) {
    console.error("Fetching user failed:", e);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
