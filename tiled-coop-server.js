const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = 7234;

const httpServer = createServer();
const io = new Server(httpServer);

io.on("connection", (socket) => {
  const { username: user, initialLayer } = socket.handshake.query;
  socket.emit("connected", createMessage({}));
  io.sockets.emit("new_user_connected", createMessage({ user, initialLayer }));

  console.log(`${user} connected!`);

  socket.on("layer_changed", (payload) => {
    console.log("layer changed!");
    io.sockets.emit(
      "user_layer_changed",
      createMessage({ user, newLayer: payload.newLayer })
    );
  });

  socket.on("disconnect", () => {
    console.log(`${user} disconnected!`);
    io.sockets.emit("user_disconnected", createMessage({ user }));
  });
});

io.listen(PORT);

function createMessage(payload) {
  return JSON.stringify(payload);
}
