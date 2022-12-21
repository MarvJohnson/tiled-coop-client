const Pusher = require("pusher-js");
const axios = require("axios");
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
  const res = await axios.post(
    "https://tiled-coop-client-menthus123.vercel.app/api/channels-event",
    data
  );
  console.log(res);
}

pushData({
  message: "hello world",
});

// import express from "express";
// const app = express();
// import { io } from "socket.io-client";
// const PORT = 7233;

// const actions = {
//   socket: null,
//   connect({ username, server, password, initialLayer }) {
//     this.socket = io(server, {
//       auth: password,
//       query: { username, initialLayer },
//     });
//     this.socket.on("connected", (data) => pipeDataToStdout("connected", data));
//     this.socket.on("user_layer_changed", (data) =>
//       pipeDataToStdout("userLayerChanged", data)
//     );
//     this.socket.on("new_user_connected", (data) =>
//       pipeDataToStdout("newUserConnected", data)
//     );
//     this.socket.on("user_disconnected", (data) =>
//       pipeDataToStdout("userDisconnected", data)
//     );
//     this.socket.on("connect_error", (data) => {
//       pipeDataToStdout(
//         "connectError",
//         JSON.stringify({ errorMessage: "failed", data })
//       );
//     });
//   },
//   layerChanged(payload) {
//     this.socket.emit("layer_changed", payload);
//   },
// };

// function pipeDataToStdout(action, data) {
//   const message = { action, payload: JSON.parse(data.toString()) };
//   process.stdout.write(JSON.stringify(message) + "\n");
// }

// process.stdin.on("data", (data) => {
//   const message = JSON.parse(data.toString());

//   if (actions[message.action]) {
//     actions[message.action](message.payload);
//   }
// });

// app.listen(PORT);
