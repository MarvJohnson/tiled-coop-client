import Pusher from "pusher";
import Channels from "pusher";

const {
  APP_ID: appId = "",
  KEY: key = "",
  SECRET: secret = "",
  CLUSTER: cluster = "",
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
    channel,
    currentLayer,
  };
  activeUsers[userID] = newUser;

  return newUser;
}

async function processJSON(readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString());
}

async function processRequest(req) {
  return new Promise(async (resolve) => {
    if (req.headers["Content-Type"] === "application/json") {
      req.body = await processJSON(req);
    }

    resolve(undefined);
  });
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default async (req, res) => {
  console.log("channels event");
  console.log(req.body);
  console.log("EdgeOutput");
  console.log(globalThis.EdgeRuntime?.testOutput);
  console.log(globalThis);

  // await processRequest(req);
  // console.log(req);
  // console.log(req.body);
  // console.log(JSON.stringify(req.body));

  const socketID = req.body?.socketID;
  const username = req.body?.username;
  const channel = req.body?.channel;
  const action = req.query?.action || "sync_upload";
  const payload = req.body?.payload;

  switch (action) {
    case "connection":
      let activeChannel = activeChannels[channel];

      if (!activeChannel) {
        activeChannel = addChannel(channel, payload.password);
      }

      if (activeChannel.activeUsers[payload.userID]) {
        break;
      }

      if (activeChannel.isPasswordProtected) {
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

      if (payload.password !== activeChannels[channel].password) {
        return res.status(403).send({});
      }

      const newAuthedUser = addUser(
        payload.userID,
        channel,
        username,
        payload.initialLayer
      );

      activeChannels[channel].activeUsers[payload.userID] = newAuthedUser;

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

      const authResponse = pusher.authorizeChannel(socketID, channel);
      console.log(JSON.stringify(authResponse));
      return res.status(200).send(authResponse);
    case "sync_upload":
      console.log("sync upload");

      let output = "";

      req.on("data", (chunk) => {
        console.log("adding data to output");
        output += chunk;
      });

      await new Promise((resolve) => {
        function helper() {
          console.log("ending stream read");
          resolve(undefined);
        }

        req.once("end", helper);
        setTimeout(helper, 10000);
      });

      console.log("output:");
      console.log(output);
      break;
  }

  res.status(200).end("Received message!");
};
