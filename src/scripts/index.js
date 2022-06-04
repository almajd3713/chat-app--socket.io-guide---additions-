import { messageConstructor } from "./constructor";
let socket = io();
let form = document.getElementById('form');
let input = document.getElementById('input');
let messagesDiv = document.querySelector('.messages');
let currentUser;
let messages;
form.addEventListener("submit", e => {
    e.preventDefault();
    socket.emit(currentUser ? "message" : "messageFirst", input.value, currentUser);
});
socket.on("initUser", (user) => {
    currentUser = user;
    refreshFields();
});
socket.on("message", (message) => {
    let msg = messageConstructor(message, "self");
    messagesDiv.appendChild(msg.base);
});
let refreshFields = () => {
    input.value = "";
    input.placeholder = "";
};
