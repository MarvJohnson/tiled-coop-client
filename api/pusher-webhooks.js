export default async (req, res) => {
  console.log(JSON.stringify(req.body));

  const { events } = req.body;

  switch (events[0].name) {
    case "channel_vacated":
      const userIDEvent = events.find((event) => event.channel.includes("#"));

      if (!userIDEvent) {
        break;
      }

      const userID = userIDEvent.channel.replace("#server-to-user-", "");
      return await fetch(
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
  }

  res.status(200).end();
};
