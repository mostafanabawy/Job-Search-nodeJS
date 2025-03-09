import { OAuth2Client } from "google-auth-library"

export async function verifyGoogleToken(idToken) {
    const client = new OAuth2Client({
        clientId: process.env.CLIENT_ID
    })
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID
    })
    return ticket.getPayload()
}