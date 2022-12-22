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
  const { socket_id: socketID, username: user } = req.body;

  const formattedUserName = user.replace(/[^A-z0-9]/g, "");
  const authResponse = pusher.authenticateUser(socketID, {
    id: formattedUserName,
  });

  res.status(200).send(authResponse);
};
