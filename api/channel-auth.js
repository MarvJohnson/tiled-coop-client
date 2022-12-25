export default async (req, res) => {
  console.log(JSON.stringify(req.body));

  const { socket_id: socketID, password } = req.body;

  return res.send(
    await fetch(
      "https://tiled-coop-client-menthus123.vercel.app/api/channels-event/",
      {
        method: "POST",
        body: JSON.stringify({
          action: "channel_auth",
          payload: {
            socketID,
            password,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  );
};
