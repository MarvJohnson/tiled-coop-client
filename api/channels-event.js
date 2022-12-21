import Channels from "pusher";

const {
  APP_ID: appId,
  KEY: key,
  SECRET: secret,
  CLUSTER: cluster,
} = process.env;

const channels = new Channels({
  appId,
  key,
  secret,
  cluster,
});

export default async (req, res) => {
  console.log("Received Data!");
  const data = req.body;
  const channelResponse = await channels.trigger("test", "test", data);
  console.log(channelResponse);
  res.status(200).end("sent event successfully");
};
