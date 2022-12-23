export default async (req, res) => {
  console.log(JSON.stringify(req.body));

  const { events } = req.body;

  switch (events[0].name) {
    case "channel_vacated":
      const eventObjOrder = events[0].name.includes("#");
      const server = eventObjOrder ? events[1].channel : events[0].channel;
      const socketID = (
        eventObjOrder ? events[0].channel : events[1].channel
      ).replace("#server-to-user-", "");
      await fetch(
        "https://tiled-coop-client-menthus123.vercel.app/api/channels-event/",
        {
          method: "POST",
          body: JSON.stringify({
            action: "user_disconnected",
            server,
            socketID,
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
