import express from "express";
const app = express();
import { io } from "socket.io-client";
const PORT = 7233;

const actions = {
  socket: null,
  connect({ username, server, password, initialLayer }) {
    this.socket = io(server, {
      auth: password,
      query: { username, initialLayer },
    });
    this.socket.on("connected", (data) => pipeDataToStdout("connected", data));
    this.socket.on("user_layer_changed", (data) =>
      pipeDataToStdout("userLayerChanged", data)
    );
    this.socket.on("new_user_connected", (data) =>
      pipeDataToStdout("newUserConnected", data)
    );
    this.socket.on("user_disconnected", (data) =>
      pipeDataToStdout("userDisconnected", data)
    );
    this.socket.on("connect_error", (data) => {
      pipeDataToStdout(
        "connectError",
        JSON.stringify({ errorMessage: "failed", data })
      );
    });
  },
  layerChanged(payload) {
    this.socket.emit("layer_changed", payload);
  },
};

function pipeDataToStdout(action, data) {
  const message = { action, payload: JSON.parse(data.toString()) };
  process.stdout.write(JSON.stringify(message) + "\n");
}

process.stdin.on("data", (data) => {
  const message = JSON.parse(data.toString());

  if (actions[message.action]) {
    actions[message.action](message.payload);
  }
});

app.listen(PORT);
