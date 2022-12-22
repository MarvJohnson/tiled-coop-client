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
  const { socket_id: socketID } = req.body;
  const { username: user } = req.params;

  const authResponse = pusher.authenticateUser(socketID, { id: user });

  res.status(200).end(authResponse);
};
