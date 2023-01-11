import Pusher from "pusher";

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
  useTLS: true,
});

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

      let host = null;

      try {
        const pusherRes = await pusher.get({
          path: `/channels/${channel}/users`,
        });

        if (pusherRes.status === 200) {
          const pusherChannelData = await pusherRes.json();

          host = pusherChannelData.users.find((user) => user.user_info.isHost);
          console.log(pusherChannelData);
        }
      } catch (err) {
        console.log("failed fetching channel info");

        return res
          .status(403)
          .send({ errorMessage: "Failed fetching channel info" });
      }

      if (host && payload.password !== host?.user_info.password) {
        return res.status(403).send({ errorMessage: "Incorrect password!" });
      }

      const authResponse = pusher.authorizeChannel(socketID, channel, {
        user_id: socketID,
        user_info: {
          username,
          currentLayer: payload.initialLayer,
          isHost: !host,
          password: payload.password,
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
