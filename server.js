const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
cors: {
origin: "*"
}
});

const onlineUsers = {};

io.on("connection", (socket) => {

console.log("User Connected");

socket.on("user-joined", (username) => {

    onlineUsers[socket.id] = username;

    socket.username = username;

    io.emit(
        "online-users",
        Object.values(onlineUsers)
    );

    if (socket.room) {

        socket.to(socket.room).emit(
            "notification",
            `🔔 ${username} joined the room`
        );

    }

});

socket.on("join-room", (data) => {

    socket.join(data.room);

    socket.room = data.room;

    socket.username = data.username;

    socket.to(data.room).emit(
        "notification",
        `🔔 ${data.username} joined the room`
    );

});

socket.on("send-message", (data) => {

    console.log("Message Received:", data);

    io.to(data.room).emit(
        "receive-message",
        data
    );

});

socket.on("typing", (data) => {

    socket.to(data.room).emit(
        "user-typing",
        data.username
    );

});

socket.on("disconnect", () => {

    const username =
        onlineUsers[socket.id];

    if (socket.room && username) {

        socket.to(socket.room).emit(
            "notification",
            `🔔 ${username} left the room`
        );

    }

    delete onlineUsers[socket.id];

    io.emit(
        "online-users",
        Object.values(onlineUsers)
    );

});

});

server.listen(5000, () => {

console.log(
    "Server Running on Port 5000"
);

});