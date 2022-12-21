import Pusher from "pusher-js";
require("dotenv").config();

const { PUSHER_KEY, PUSHER_CLUSTER } = process.env;

let channels = new Pusher(PUSHER_KEY, {
  cluster: PUSHER_CLUSTER,
});
let channel = channels.subscribe("test");

channel.bind("test", function (data) {
  console.log("testing");
});

async function pushData(data) {
  const res = await fetch("/api/channels-event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    console.error("failed to push data");
  }
}
