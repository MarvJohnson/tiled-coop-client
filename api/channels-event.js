import Pusher from "pusher";
import Channels from "pusher";

const {
  APP_ID: appId,
  KEY: key,
  SECRET: secret,
  CLUSTER: cluster,
} = process.env;

const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster,
});

const channels = new Channels({
  appId,
  key,
  secret,
  cluster,
});

const activeChannels = {};
const activeUsers = {};

function addChannel(channel, password) {
  activeChannels[channel] = {
    isPasswordProtected: !!password,
    password,
    activeUsers: [],
  };
}

function addUser(userID, server, user, currentLayer) {
  activeUsers[userID] = {
    user,
    server,
    currentLayer,
  };
}

export default async (req, res) => {
  console.log(JSON.stringify(req.body));

  const {
    socketID,
    username: user = null,
    channel,
    action,
    payload = null,
  } = req.body;

  switch (action) {
    case "connection":
      if (activeChannels[channel]) {
        const channelInstance = activeChannels[channel];

        if (
          !channelInstance.isPasswordProtected ||
          password === channelInstance.password
        ) {
        } else {
          await channels.sendToUser(payload.userID, "failed_password", {
            channel: Object.entries(activeUsers),
          });
        }
      }
      addUser(payload.userID, channel, user, payload.initialLayer);

      await channels.trigger(
        channel,
        "new_user_connected",
        {
          user,
          initialLayer: payload.initialLayer,
          userID: payload.userID,
        },
        { socket_id: socketID }
      );

      await channels.sendToUser(payload.userID, "new_connection_payload", {
        channel: activeChannels[channel].users,
      });
      break;
    case "layer_changed":
      activeUsers[payload.userID].currentLayer = payload.newLayer;

      await channels.trigger(
        channel,
        "user_layer_changed",
        {
          user,
          newLayer: payload.newLayer,
          userID: payload.userID,
        },
        { socket_id: socketID }
      );
      break;
    case "user_disconnected":
      if (!activeUsers[payload.userID]) {
        break;
      }

      await channels.trigger(
        activeUsers[payload.userID].server,
        "user_disconnected",
        {
          userID: payload.userID,
        }
      );

      delete activeUsers[payload.userID];
      break;
    case "channel_auth":
      const authResponse = pusher.authorizeChannel(socketID, channel);
      return res.status(200).send(authResponse);
  }

  res.status(200).end("Received message!");
};
