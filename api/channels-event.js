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

// const channels = new Channels({
//   appId,
//   key,
//   secret,
//   cluster,
// });

export default async (req, res) => {
  console.log("channels event");

  const socketID = req.body?.socketID;
  const username = req.body?.username;
  const channel = req.body?.channel;
  const action = req.query?.action || "sync_upload";
  const payload = req.body?.payload || {};

  switch (action) {
    case "channel_auth":
      console.log("Channel authing!");

      if (false) {
        return res.status(403).send({});
      }

      console.log(await pusher.get(`/channels/${channel}`));

      const authResponse = pusher.authorizeChannel(socketID, channel, {
        user_id: socketID,
        user_info: {
          username,
          currentLayer: payload.initialLayer,
        },
      });
      console.log(JSON.stringify(authResponse));
      return res.status(200).send(authResponse);
    case "sync_upload":
      console.log("sync upload");
      console.log(req.body);
      break;
  }

  res.status(200).end("Received message!");
};
