import React, { useEffect } from "react";
import { Client } from "@pusher/push-notifications-web";
import { configureBeans } from "../configuration/beansConfiguration";
//import dotenv from "dotenv";
//dotenv.config();

export const beamsClient = new Client({
  instanceId: "7e69ae50-bb55-4360-9819-4c8bfd05a7b2",
});

interface Props {
  children: React.ReactNode;
}

const PusherClient = ({ children }: Props) => {
  useEffect(() => {
    const externalId = sessionStorage.getItem("externalId");
    const token = sessionStorage.getItem("token") || "-1";

    if (externalId && token !== "-1") {
      configureBeans(beamsClient, externalId, token);
    } else {
      console.warn("Token or ExternalId not provided!");
    }
  }, []);

  return <div>{children}</div>;
};

export default PusherClient;
