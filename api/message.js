import { Redis } from '@upstash/redis';
import { getConnecterUser, triggerNotConnected } from "../lib/session.js";
import PushNotifications from '@pusher/push-notifications-server';

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
            let body;
            if (typeof request.body === 'string') {
                body = JSON.parse(request.body);
            } else {
                body = request.body;
            }

            const { recipientId, sender, messageContent } = body;

            if (!recipientId || !messageContent.trim()) {
                return response.status(400).json({ error: "Recipient ID and valid message content are required." });
            }

            // Déterminer la clé de conversation
            const conversationKey = `conversation:${[userId, recipientId].sort().join(":")}`;

            const message = {
                senderId: userId,
                sender: sender,
                content: messageContent,
                timestamp: new Date().toISOString()
            };

            const expirationTimeInSeconds = 24*60*60;
            await redis.lpush(conversationKey, JSON.stringify(message));
            await redis.expire(conversationKey, expirationTimeInSeconds);

            const beamsClient = new PushNotifications({
                instanceId: "7e69ae50-bb55-4360-9819-4c8bfd05a7b2",
                secretKey: "3CDA930BEE66856757EE11118C47C11F868E9F03F95E581654C42614E10B356B",
            });

            console.log(recipientId);
            const publishResponse = await beamsClient.publishToUsers([recipientId.toString()], {
                web: {
                    notification: {
                        title: user.username,
                        body: message.content,
                        ico: "https://www.univ-brest.fr/themes/custom/ubo_parent/favicon.ico",
                        deep_link: "http://localhost:3000",
                    },
                    data: {
                        /* additionnal data */
                    }
                },
            });

            return response.status(200).json({ success: true });
        } else if (request.method === "GET") {
            const { recipientId } = request.query;
            if (!recipientId) {
                return response.status(400).json({ error: "Recipient ID is required." });
            }

            // Déterminer la clé de conversation
            const conversationKey = `conversation:${[userId, recipientId].sort().join(":")}`;

            // Lire la liste de messages depuis Redis
            const messages = await redis.lrange(conversationKey, 0, -1);
            console.log("messages");
            console.log(messages);
            
            const parsedMessages = messages.map(msg => {
                if (typeof msg === 'string') {
                    try {
                        return JSON.parse(msg); // Si ce n'est pas un JSON valide, il retourne null
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
        return response.status(500).json({ error: "Invalid JSON in Redis or other server error" });
    }
}
