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
                        event_volunteers: true,
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
                    const requiredTokens = event.event_volunteers.length * event.token_bounty;

                    const userWallet = await prisma.wallet.findUniqueOrThrow({
                        where: {
                            userId: userID as string,
                        },
                    });

                    if (userWallet.balance < requiredTokens) {
                        return new Response("Not enough tokens to pay volunteers!", {
                            status: 403,
                        });
                    }

                    await releaseTokensAndCompleteEvent(event, userID);

                    // V 1
                    // await prisma.wallet.update({
                    //     where: { id: userWallet.id },
                    //     data: { balance: { decrement: requiredTokens } },
                    // });

                    // for (const volunteer of event.event_volunteers) {
                    //     const volunteerWallet = await prisma.wallet.findUnique({
                    //         where: { userId: volunteer.volunteerId },
                    //     });

                    //     if (volunteerWallet) {
                    //         await prisma.wallet.update({
                    //             where: { id: volunteerWallet.id },
                    //             data: { balance: { increment: event.token_bounty } },
                    //         });
                    //     }
                    // }

                    // V 2
                    // for (const volunteer of event.event_volunteers) {
                    //     // Fetch the organization's wallet balance before each transfer
                    //     const organizationWallet = await prisma.wallet.findUniqueOrThrow({
                    //         where: { userId: organizationID },
                    //     });

                    //     if (organizationWallet.balance < event.token_bounty) {
                    //         // If at any point the balance is not sufficient, stop the process
                    //         return new Response("Not enough tokens to continue paying volunteers", { status: 403 });
                    //     }

                    //     // Deduct tokens from the organization's wallet
                    //     await prisma.wallet.update({
                    //         where: { id: organizationWallet.id },
                    //         data: { balance: { decrement: event.token_bounty } },
                    //     });

                    //     // Increment the volunteer's wallet balance
                    //     const volunteerWallet = await prisma.wallet.findUniqueOrThrow({
                    //         where: { userId: volunteer.volunteerId },
                    //     });

                    //     await prisma.wallet.update({
                    //         where: { id: volunteerWallet.id },
                    //         data: { balance: { increment: event.token_bounty } },
                    //     });

                    //     // Create a transaction record
                    //     await prisma.transaction.create({
                    //         data: {
                    //             sourceWalletId: organizationWallet.id,
                    //             destinationWalletId: volunteerWallet.id,
                    //             amount: event.token_bounty,
                    //         },
                    //     });
                    // }

                    // await prisma.event.update({
                    //     where: { id: eventID },
                    //     data: { status: 'COMPLETE' },
                    // });
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

// V 3
async function releaseTokensAndCompleteEvent(event: any, userID: any) {
    const organizationWallet = await prisma.wallet.findUniqueOrThrow({
        where: { userId: userID as string },
    });

    for (const volunteer of event.event_volunteers) {

        const volunteerWallet = await prisma.wallet.findUniqueOrThrow({
            where: { userId: volunteer.volunteerId },
        });

        await prisma.$transaction([
            prisma.wallet.update({
                where: { id: organizationWallet.id },
                data: { balance: { decrement: event.token_bounty } },
            }),
            prisma.wallet.update({
                where: { userId: volunteer.userId },
                data: { balance: { increment: event.token_bounty } },
            }),
            prisma.transaction.create({
                data: {
                    sourceWalletId: organizationWallet.id,
                    destinationWalletId: volunteerWallet.id,
                    amount: event.token_bounty,
                },
            })
        ]);
    }

    await prisma.event.update({
        where: { id: event.id },
        data: { status: 'COMPLETE' },
    });
}