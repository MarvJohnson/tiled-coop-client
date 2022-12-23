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

global.activeChannels = {};

export default async (req, res) => {
  const {
    socketID,
    username: user = null,
    server,
    action,
    payload = null,
  } = req.body;

  switch (action) {
    case "connection":
      if (!activeChannels[server]) {
        activeChannels[server] = {};
      }

      activeChannels[server][socketID] = {
        user,
        currentLayer: payload.initialLayer,
      };

      await channels.trigger(
        server,
        "new_user_connected",
        {
          user,
          initialLayer: payload.initialLayer,
        },
        { socket_id: socketID }
      );

      await channels.sendToUser(payload.userID, "new_connection_payload", {
        channel: activeChannels[server],
      });
      break;
    case "layer_changed":
      activeChannels[server][socketID].currentLayer = payload.newLayer;

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
    case "user_disconnected":
      delete activeChannels[server][socketID];

      if (Object.keys(activeChannels[server]).length === 0) {
        delete activeChannels[server];
      }
      break;
  }

  res.status(200).end("Received message!");
};
