export default async (req, res) => {
  console.log(JSON.stringify(req.body));
  const { socket_id: socketID, channel_name: channel, password } = req.body;

  try {
    const response = await fetch(
      "https://tiled-coop-client-menthus123.vercel.app/api/channels-event/",
      {
        method: "POST",
        body: JSON.stringify({
          action: "channel_auth",
          socketID,
          channel,
          payload: {
            password,
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

    return res.send(json);
  } catch (err) {
    return res.status(403).end();
  }
};
