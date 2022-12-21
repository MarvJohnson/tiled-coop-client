import Pusher from "pusher";
require("dotenv").config();

const { PUSHER_KEY, PUSHER_CLUSTER } = process.env;

let channels = new Pusher(PUSHER_KEY, {
  cluster: PUSHER_CLUSTER,
});
let channel = channels.subscribe("test");

channel.bind("test", function (data) {
  console.log("testing");
});
