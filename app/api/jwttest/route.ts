import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    const token = await getToken({ req });

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
