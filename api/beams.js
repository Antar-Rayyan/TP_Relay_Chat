import {getConnecterUser, triggerNotConnected} from "../lib/session.js";
import PushNotifications from "@pusher/push-notifications-server";


export default async (req, res) => {

    const userIDInQueryParam = req.query["user_id"];
    const user = await getConnecterUser(req);
    console.log("PushToken : " + userIDInQueryParam + " -> " + JSON.stringify(user));
    if (user === undefined || user === null || userIDInQueryParam !== user.externalId) {
        console.log("Not connected");
        triggerNotConnected(res);
        return;
    }

    console.log("Using push instance : " + process.env.PUSHER_INSTANCE_ID);
    const beamsClient = new PushNotifications({
        instanceId: "7e69ae50-bb55-4360-9819-4c8bfd05a7b2",
        secretKey: "3CDA930BEE66856757EE11118C47C11F868E9F03F95E581654C42614E10B356B",
    });

    const beamsToken = beamsClient.generateToken(user.externalId);
    console.log(JSON.stringify(beamsToken));
    res.send(beamsToken);
};