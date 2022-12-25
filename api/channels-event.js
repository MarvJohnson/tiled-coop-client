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
  const newChannel = {
    isPasswordProtected: !!password,
    password,
    activeUsers: {},
  };

  activeChannels[channel] = newChannel;

  return newChannel;
}

function addUser(userID, channel, username, currentLayer) {
  const newUser = {
    username,
    server: channel,
    currentLayer,
  };
  activeUsers[userID] = newUser;

  return newUser;
}

export default async (req, res) => {
  console.log(JSON.stringify(req.body));

  const {
    socketID,
    username = null,
    channel,
    action,
    payload = null,
  } = req.body;

  switch (action) {
    case "connection":
      if (!activeChannels[channel]) {
        addChannel(channel, payload.password);
      }

      if (activeChannels[channel].activeUsers[payload.userID]) {
        break;
      }

      const newUser = addUser(
        payload.userID,
        channel,
        username,
        payload.initialLayer
      );

      activeChannels[channel].activeUsers[payload.userID] = newUser;

      await channels.trigger(
        channel,
        "new_user_connected",
        {
          username,
          initialLayer: payload.initialLayer,
          userID: payload.userID,
        },
        { socket_id: socketID }
      );

      await channels.sendToUser(payload.userID, "new_connection_payload", {
        channel: Object.entries(activeChannels[channel].activeUsers),
      });
      break;
    case "layer_changed":
      activeUsers[payload.userID].currentLayer = payload.newLayer;

      await channels.trigger(
        channel,
        "user_layer_changed",
        {
          username,
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
        activeUsers[payload.userID].channel,
        "user_disconnected",
        {
          userID: payload.userID,
        }
      );

      const userChannel = activeUsers[payload.userID].channel;
      delete activeChannels[userChannel].activeUsers[payload.userID];

      if (Object.keys(activeChannels[userChannel].activeUsers).length === 0) {
        delete activeChannels[userChannel];
      }

      delete activeUsers[payload.userID];
      break;
    case "channel_auth":
      console.log("Channel authing!");
      const authResponse = pusher.authorizeChannel(socketID, channel);
      console.log(JSON.stringify(authResponse));
      return res.status(200).send(authResponse);
  }

  res.status(200).end("Received message!");
};
