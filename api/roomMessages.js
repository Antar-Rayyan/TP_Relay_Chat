import { Redis } from '@upstash/redis';
import { getConnecterUser, triggerNotConnected } from "../lib/session.js";

const redis = Redis.fromEnv();

export default async function handler(request, response) {
    try {
        const user = await getConnecterUser(request);
        if (!user) {
            console.log("Not connected");
            return response.send(triggerNotConnected());
        }

        const userId = user.id;

        if (request.method === "POST") {
            // Récupérer le corps de la requête
            let body;
            if (typeof request.body === 'string') {
                body = JSON.parse(request.body);
            } else {
                body = request.body;
            }

            const { roomId, sender, messageContent } = body;

            if (!roomId || !messageContent.trim()) {
                return response.status(400).json({ error: "Room name and valid message content are required." });
            }

            // Déterminer la clé de conversation
            const roomKey = `room:${roomId}`;

            const message = {
                senderId: userId,
                sender: sender,
                content: messageContent,
                timestamp: new Date().toISOString(),
            };

            const expirationTimeInSeconds = 24*60*60;

            await redis.lpush(roomKey, JSON.stringify(message));

            await redis.expire(roomKey, expirationTimeInSeconds);

            return response.status(200).json({ success: true });
        } else if (request.method === "GET") {
            const { roomId } = request.query;

            if (!roomId) {
                return response.status(400).json({ error: "Room name is required." });
            }

            const roomKey = `room:${roomId}`;

            const messages = await redis.lrange(roomKey, 0, -1);

            const parsedMessages = messages.map(msg => {
                if (typeof msg === 'string') {
                    try {
                        return JSON.parse(msg);
                    } catch (error) {
                        console.warn("Un message n'est pas un JSON valide:", msg);
                        return null;
                    }
                } else {
                    return msg;
                }
            }).filter(Boolean);

            return response.status(200).json(parsedMessages);
        }

        return response.status(405).send("Method Not Allowed");
    } catch (error) {
        console.error("Error:", error);
        return response.status(500).json({ error: "Server error occurred" });
    }
}
