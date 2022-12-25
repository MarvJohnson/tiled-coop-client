export default async (req, res) => {
  const { socket_id, password } = req.body;

  return res.send(
    await fetch(
      "https://tiled-coop-client-menthus123.vercel.app/api/channels-event/",
      {
        method: "POST",
        body: JSON.stringify({
          action: "channel_auth",
          socket_id,
          payload: {
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
