import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';
import { arrayBufferToBase64, stringToArrayBuffer } from "../lib/base64";

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

export default async function handler(request) {
    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return new Response(
                JSON.stringify({ message: "Tous les champs doivent être renseignés." }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            );
        }

        const client = await db.connect();
        const { rowCount: usernameCount } = await client.sql`
            SELECT * FROM users WHERE username = ${username}
        `;
        const { rowCount: emailCount } = await client.sql`
            SELECT * FROM users WHERE email = ${email}
        `;

        if (usernameCount > 0) {
            return new Response(
                JSON.stringify({ message: "Nom d'utilisateur déjà pris." }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            );
        }

        if (emailCount > 0) {
            return new Response(
                JSON.stringify({ message: "Email déjà utilisé." }),
                { status: 400, headers: { 'content-type': 'application/json' } }
            );
        }

        const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
        const hashed64 = arrayBufferToBase64(hash);
        const externalId = crypto.randomUUID().toString();

        const result = await client.sql`
            INSERT INTO users (username, password, email, created_on, external_id)
            VALUES (${username},  ${hashed64}, ${email}, now(), ${externalId})
            RETURNING user_id, username, email, external_id;
        `;

        const newUser = result.rows[0];
        const token = crypto.randomUUID().toString();

        await redis.set(token, newUser, { ex: 3600 });
        await redis.hset("users", { [newUser.user_id]: newUser });

        return new Response(
            JSON.stringify({
                token,
                username: newUser.username,
                email: newUser.email,
                externalId: newUser.external_id,
                id: newUser.user_id,
            }),
            { status: 200, headers: { 'content-type': 'application/json' } }
        );
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ message: "Erreur lors de l'inscription." }),
            { status: 500, headers: { 'content-type': 'application/json' } }
        );
    }
}
