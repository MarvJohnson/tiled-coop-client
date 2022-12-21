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

export default (req, res) => {
  const data = req.body;
  channels.trigger("test", "test", data, () => {
    res.status(200).end("sent event successfully");
  });
};
