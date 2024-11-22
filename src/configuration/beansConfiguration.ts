import { Client, TokenProvider } from "@pusher/push-notifications-web";

export const configureBeans = async (client: Client, externalId: string, token: string) => {
    try {
        const currentUserId = await client.getUserId();
        if (externalId === currentUserId) {
            return;
        }

        const beamsTokenProvider = new TokenProvider({
            url: "/api/beams",
                headers: {
                    'Authentication': `Bearer ${token}`,
                },
        });
        
        client.start()
            .then(() => client.addDeviceInterest('global'))
            .then(() => client.setUserId(externalId, beamsTokenProvider))
            .then(() => {
                client.getDeviceId().then(deviceId => console.log("Push id : " + deviceId));
            })
            .catch(console.error);
        
    } catch (error) {
        console.error("Configuration failed : " + error);
    }
};