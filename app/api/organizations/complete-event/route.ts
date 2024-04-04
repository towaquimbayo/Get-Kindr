import prisma from "@/lib/prisma";
import { AccountType } from "@prisma/client";
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

/**
 * Endpoint for orginizations to complete an event: POST /api/organizations/complete-event
 * 
 * Checks if the user is an organization and then completes the event and pays out the volunteers
 * First checks if the event is complete,
 * then checks if the orginization has enough tokens to pay out the volunteers,
 * sets the event to complete and pays out the volunteers deducting the tokens from the organization
 * 
 * request parameters:
 * - eventID: The event to complete and pay out
 *
 * @param {NextRequest} request - The incoming request
 */
export async function POST(req: NextRequest) {
    const token = await getToken({ req });
    const { eventID } = await req.json();

    if (token) {
        const accountType = token.accountType;
        const organizationID = token.organizationID;
        const userID = token.id;

        if (!organizationID ||
            !userID ||
            accountType !== AccountType.ORGANIZATION) {
            return new Response("Missing ID or not an organization!", {
                status: 401,
            });
        } else {
            try {
                const event = await prisma.event.findUniqueOrThrow({
                    where: {
                        id: eventID,
                    },
                    include: {
                        event_volunteers: {
                            include: {
                                volunteer: {
                                    select: {
                                        id: true,
                                        userId: true,
                                    },
                                },
                            }
                        }
                    },
                });

                const eventEndTime = new Date(event.end_time);
                const currentTime = new Date();

                if (event.status == "COMPLETE" ||
                    eventEndTime > currentTime) {
                    return new Response("Event is already complete or not yet ended!", {
                        status: 400,
                    });
                } else if (event.organization_id !== organizationID) {
                    return new Response("Event belongs to another organization!", {
                        status: 403,
                    });
                } else {
                    await releaseTokensAndCompleteEvent(event, userID);
                    return new Response("Event closed and tokens released", { status: 200 });
                }
            } catch (error) {
                console.error(error);
                return new Response(JSON.stringify(error), {
                    status: 500,
                });
            }
        }
    } else {
        return new Response("Missing Token!", {
            status: 401,
        });
    }
}

/**
 * Deducts the tokens from the organization and pays out the volunteers for the 
 * Then sets the event to complete
 * 
 * @param event The event to complete
 * @param userID The user ID of the organization completing and paying out the event
 */
async function releaseTokensAndCompleteEvent(event: any, userID: any) {
    const requiredTokens = event.event_volunteers.length * event.token_bounty;

    const userBalance = await prisma.user.findUniqueOrThrow({
        where: { 
            id: userID as string,
        },
        select: {
            tokenBalance: true,
        },
    });

    if (userBalance.tokenBalance < requiredTokens) {
        return new Response("Not enough tokens to pay volunteers!", {
            status: 403,
        });
    }

    for (const volunteer of event.event_volunteers) {
        const UID = volunteer.volunteer.userId;

        await prisma.$transaction([
            prisma.user.update({
                where: { id: userID as string },
                data: { tokenBalance: { decrement: event.token_bounty } },
            }),
            prisma.user.update({
                where: { id: UID },
                data: { tokenBalance: { increment: event.token_bounty } },
            })
        ]);
    }

    await prisma.event.update({
        where: { id: event.id },
        data: { status: 'COMPLETED' },
    });
}