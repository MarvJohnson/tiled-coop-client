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
  // const { socket_id: socketID, ...restBody } = req.body;
  // const { username: user, ...restParams } = req.params;
  console.log("rest body");
  console.log(JSON.stringify(req.body));
  console.log(JSON.stringify(req.params));
  console.log(JSON.stringify(req.query));

  // const authResponse = pusher.authenticateUser(socketID, { id: user });

  // res.status(200).end(authResponse);
  res.status(200).end();
};
