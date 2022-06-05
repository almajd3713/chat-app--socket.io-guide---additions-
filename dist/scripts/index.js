import { messageConstructor } from "./constructor.js";
// @ts-ignore
// ignored because io() is imported with the html file, not here
export let socket = io();
let form = document.getElementById('form');
let input = document.getElementById('input');
let messagesDiv = document.querySelector('.messages');
let currentUser;
let messages = [];
let replySwitch = false;
form.addEventListener("submit", e => {
    e.preventDefault();
    socket.emit(!currentUser ? "messageFirst" : "message", input.value, currentUser);
    refreshFields();
});
socket.on("loadOldMessage", (message) => {
    messageConstructor(message, currentUser, "other");
    messagesDiv.appendChild(message.messageStructure);
});
socket.on("initUser", (user) => {
    currentUser = user;
});
socket.on("message", (message, type) => {
    messages.push(message);
    messageConstructor(message, currentUser, type);
    messagesDiv.appendChild(message.messageStructure);
});
socket.on("edit", (message) => {
    let desiredMessage = messages.find(mes => mes.id === message.id);
    desiredMessage.content = message.content;
    desiredMessage.messageStructure.querySelector(".messageText").textContent = `${message.content} ${message.isEdited ? "(edited)" : ""}`;
});
let refreshFields = () => {
    input.value = "";
    input.placeholder = "";
};
