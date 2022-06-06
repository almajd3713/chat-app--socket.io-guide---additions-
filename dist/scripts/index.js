import * as util from "./util.js";
import { messageConstructor, replyFormSwitch } from "./constructor.js";
// @ts-ignore
// ignored because io() is imported with the html file, not here
export let socket = io();
// @ts-ignore
window.socket = socket;
export let form = document.getElementById('form');
export let input = document.getElementById('input');
export let messagesDiv = document.querySelector('.messages');
export let currentUser;
export let messages = [];
form.addEventListener("submit", e => {
    e.preventDefault();
    if (input.value.length !== 0 && /\S/.test(input.value)) {
        socket.emit(!currentUser ? "messageFirst" : "message", input.value, currentUser, replyFormSwitch.message);
        if (replyFormSwitch.message) {
            replyFormSwitch.message.messageStructure.style.backgroundColor = replyFormSwitch.message.color;
            replyFormSwitch.message = false;
        }
    }
    refreshFields();
});
socket.on("initUser", (user) => {
    currentUser = user;
});
socket.on("message", (message, type) => {
    messages.push(message);
    messageConstructor(message, currentUser, type);
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
