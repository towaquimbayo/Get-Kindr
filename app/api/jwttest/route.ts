import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    const token = await getToken({ req });

    // console.log("\n\n\n***** Raw req data *****\n", req);

    if (session) {
        console.log("Valid Session, Received Sessiob: ", session);
    } else {
        console.log("Invalid Session, Received Session: ", session);
    }

    if (token) {
        console.log("Valid Token, Received Token: ", token);
        const accountType = token.accountType;
        const userId = token.id;
        console.log("Account Type: ", accountType);
        console.log("Type of accountType: ", typeof accountType);
        console.log("User ID: ", userId);
        console.log("Type of userId: ", typeof userId);

        return new Response(
            "API Recieved Valid token with uid: " + userId +
            " accountType: " + accountType, {
            status: 200,
        });
    } else {
        console.log("Invalid Token, Received Token: ", token);
        return new Response("API Recieved Invalid Token", {
            status: 401,
        });
    }
}
