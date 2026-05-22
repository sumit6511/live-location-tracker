const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("send-location", (data) => {
    if (
      data &&
      typeof data.latitude === "number" &&
      typeof data.longitude === "number"
    ) {
      io.emit("location-update", { id: socket.id, ...data });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    io.emit("user-disconnect", { id: socket.id });
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(PORT, () => {
  console.log(`The app is listening on port ${PORT}!`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Use a different PORT.`);
  } else {
    console.error("Server error:", err);
  }
});
