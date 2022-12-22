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
  const { username: user, server, action, payload, ...rest } = req.body;

  console.log(JSON.stringify(rest));

  switch (action) {
    case "connection":
      await channels.trigger(server, "new_user_connected", {
        user,
        initialLayer: payload.initialLayer,
      });
      break;
    case "layer_changed":
      await channels.trigger(server, "user_layer_changed", {
        user,
        newLayer: payload.newLayer,
      });
      break;
  }

  res.status(200).end("Received message!");
};
