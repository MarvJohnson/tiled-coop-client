import Pusher from "pusher";
import { v4 as uuidv4 } from "uuid";

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
  const uuid = uuidv4();
  const authResponse = pusher.authenticateUser(socketID, {
    id: uuid,
    user,
  });

  res.status(200).json(authResponse);
};
