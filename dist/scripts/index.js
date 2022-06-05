import { messageConstructor } from "./constructor.js";
// @ts-ignore
// ignored because io() is imported with the html file, not here
let socket = io();
let form = document.getElementById('form');
let input = document.getElementById('input');
let messagesDiv = document.querySelector('.messages');
let currentUser;
let messages;
let replySwitch = false;
form.addEventListener("submit", e => {
    e.preventDefault();
    socket.emit(!currentUser ? "messageFirst" : "message", input.value, currentUser);
    refreshFields();
});
socket.on("loadOldMessage", message => {
    messagesDiv.appendChild(messageConstructor(message, "other"));
});
socket.on("initUser", (user) => {
    currentUser = user;
});
socket.on("message", (message, type) => {
    message.messageStructure = messageConstructor(message, type);
    messagesDiv.appendChild(message.messageStructure);
});
let refreshFields = () => {
    input.value = "";
    input.placeholder = "";
};
