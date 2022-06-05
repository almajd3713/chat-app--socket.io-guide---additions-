import * as util from "./util.js";
import { messageConstructor } from "./constructor.js";
// @ts-ignore
// ignored because io() is imported with the html file, not here
export let socket = io();
// @ts-ignore
window.socket = socket;
let form = document.getElementById('form');
let input = document.getElementById('input');
let messagesDiv = document.querySelector('.messages');
let currentUser;
export let messages = [];
let replySwitch = false;
form.addEventListener("submit", e => {
    e.preventDefault();
    socket.emit(!currentUser ? "messageFirst" : "message", input.value, currentUser);
    refreshFields();
});
socket.on("initUser", (user) => {
    currentUser = user;
});
socket.on("message", (message, type) => {
    messages.push(message);
    messageConstructor(message, currentUser, type);
    messagesDiv.appendChild(message.messageStructure);
    viewportCheck(message.messageStructure);
});
socket.on("edit", (message) => {
    let desiredMessage = messages.find(mes => mes.id === message.id);
    desiredMessage.content = message.content;
    desiredMessage.messageStructure.querySelector(".messageText").textContent = `${message.content} ${message.isEdited ? "(edited)" : ""}`;
});
socket.on("delete", (message) => {
    let desiredMessage = messages.find(mes => mes.id === message.id);
    desiredMessage.messageStructure.remove();
    messages = messages.filter(mes => mes.id !== message.id);
});
let viewportCheck = (el) => {
    let messageArr = Array.from(messagesDiv.children);
    let viewportCheckMessage = messageArr[messageArr.indexOf(el) - 2];
    if (viewportCheckMessage && util.isInViewport(viewportCheckMessage)) {
        el.scrollIntoView();
    }
};
let refreshFields = () => {
    input.value = "";
    input.placeholder = "";
};
