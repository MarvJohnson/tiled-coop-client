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

const users = {};

function addUser(userID, server, user, currentLayer) {
  users[userID] = {
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
    server,
    action,
    payload = null,
  } = req.body;

  switch (action) {
    case "connection":
      addUser(payload.userID, server, user, payload.initialLayer);

      await channels.trigger(
        server,
        "new_user_connected",
        {
          user,
          initialLayer: payload.initialLayer,
          userID: payload.userID,
        },
        { socket_id: socketID }
      );

      await channels.sendToUser(payload.userID, "new_connection_payload", {
        channel: Object.entries(users),
      });
      break;
    case "layer_changed":
      users[payload.userID].currentLayer = payload.newLayer;

      await channels.trigger(
        server,
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
      console.log("disconnecting user!");
      console.log(JSON.stringify(users));

      if (!users[payload.userID]) {
        break;
      }

      await channels.trigger(
        users[payload.userID].server,
        "user_disconnected",
        {
          userID: payload.userID,
        }
      );

      delete users[payload.userID];
      break;
  }

  res.status(200).end("Received message!");
};
