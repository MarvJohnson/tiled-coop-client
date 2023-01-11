export default async (req, res) => {
  console.log("channel-authing!");
  console.log(JSON.stringify(req.body));
  const {
    username,
    socket_id: socketID,
    channel_name: channel,
    password,
    userID,
    initialLayer,
  } = req.body;

  try {
    const response = await fetch(
      "https://tiled-coop-client-menthus123.vercel.app/api/channels-event/?action=channel_auth",
      {
        method: "POST",
        body: JSON.stringify({
          socketID,
          channel,
          username,
          payload: {
            password,
            userID,
            initialLayer,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();

    console.log("Response from channel-event");
    console.log(json);

    return res.status(200).send(json);
  } catch (err) {
    return res.status(403).end();
  }
};
