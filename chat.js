const socket = io("http://localhost:5000");

function joinRoom() {

    const username =
        document.getElementById("username").value;

    const room =
        document.getElementById("room").value;

    if (username === "" || room === "") {

        alert("Enter Username and Room");
        return;
    }

    socket.emit("user-joined", username);

    socket.emit("join-room", {
    username,
    room
});

    alert(`${username} joined ${room}`);

}

function sendMessage() {

const username =
    document.getElementById("username").value;

const room =
    document.getElementById("room").value;

const message =
    document.getElementById("message").value;

if (
    username === "" ||
    room === "" ||
    message === ""
) {

    alert("Fill all fields");

    return;

}

socket.emit("send-message", {
    username,
    room,
    message
});

document.getElementById("message").value = "";

}

document
.getElementById("message")
.addEventListener("input", () => {

const username =
    document.getElementById("username").value;

const room =
    document.getElementById("room").value;

socket.emit("typing", {
    username,
    room
});

});

socket.on("receive-message", (data) => {

const messagesDiv =
    document.getElementById("messages");

const time =
    new Date().toLocaleTimeString();

messagesDiv.innerHTML += `
    <div class="message">
        <strong>${data.username}</strong>:
        ${data.message}
        <small>${time}</small>
    </div>
`;

messagesDiv.scrollTop =
    messagesDiv.scrollHeight;

});

socket.on("online-users", (users) => {

const usersList =
    document.getElementById("users");

usersList.innerHTML = "";

users.forEach((user) => {

    usersList.innerHTML += `
        <li>${user}</li>
    `;

});

});

socket.on("user-typing", (username) => {

const typingStatus =
    document.getElementById(
        "typing-status"
    );

typingStatus.innerText =
    `${username} is typing...`;

setTimeout(() => {

    typingStatus.innerText = "";

}, 2000);

});

socket.on("notification", (msg) => {

    const messagesDiv =
        document.getElementById("messages");

    messagesDiv.innerHTML += `
        <div class="notification">
            ${msg}
        </div>
    `;

});