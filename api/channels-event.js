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
  const { socketID, username: user, server, action, payload } = req.body;

  switch (action) {
    case "connection":
      await channels.trigger(
        server,
        "new_user_connected",
        {
          user,
          initialLayer: payload.initialLayer,
        },
        { socket_id: socketID }
      );
      break;
    case "layer_changed":
      await channels.trigger(
        server,
        "user_layer_changed",
        {
          user,
          newLayer: payload.newLayer,
        },
        { socket_id: socketID }
      );
      break;
  }

  res.status(200).end("Received message!");
};
