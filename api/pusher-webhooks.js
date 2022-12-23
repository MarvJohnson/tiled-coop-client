export default async (req, res) => {
  const { events } = req.body;

  switch (events[0].name) {
    case "channel_vacated":
      const server = events[0].channel;
      const socketID = events[1].channel.replace("#server-to-user-");
      await fetch("/api/channels-event", {
        method: "POST",
        body: {
          action: "user_disconnected",
          server,
          socketID,
        },
      });
      break;
  }
  console.log(JSON.stringify(req.body));
  console.log(Object.keys(global));
  res.status(200).end();
};
