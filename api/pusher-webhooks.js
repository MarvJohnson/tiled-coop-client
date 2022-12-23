export default async (req, res) => {
  console.log(JSON.stringify(req.body));

  const { events } = req.body;

  switch (events[0].name) {
    case "channel_vacated":
      const userID = events
        .find((event) => event.channel.includes("#"))
        .channel.replace("#server-to-user-", "");
      await fetch(
        "https://tiled-coop-client-menthus123.vercel.app/api/channels-event/",
        {
          method: "POST",
          body: JSON.stringify({
            action: "user_disconnected",
            payload: {
              userID,
            },
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      break;
  }

  res.status(200).end();
};
