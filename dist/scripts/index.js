var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        formSwitchReset();
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
socket.on("dis", () => {
    console.log("Aye");
    socket.disconnect(true);
});
let viewportCheck = (el) => {
    let messageArr = Array.from(messagesDiv.children);
    let viewportCheckMessage = messageArr[messageArr.indexOf(el)];
    if (viewportCheckMessage && util.isInViewport(viewportCheckMessage)) {
        el.scrollIntoView();
    }
};
let formSwitchReset = () => {
    if (replyFormSwitch.message) {
        replyFormSwitch.message.messageStructure.style.backgroundColor = replyFormSwitch.message.color;
        replyFormSwitch.message = false;
    }
};
let refreshFields = () => {
    input.value = "";
    input.placeholder = "";
};
document.addEventListener("paste", (e) => __awaiter(void 0, void 0, void 0, function* () {
    if (!currentUser)
        return;
    let a = e.clipboardData.files[0];
    if (a) {
        let img = yield a.arrayBuffer();
        socket.emit("message", `Sent an image: `, currentUser, replyFormSwitch.message, img);
        formSwitchReset();
    }
}));
