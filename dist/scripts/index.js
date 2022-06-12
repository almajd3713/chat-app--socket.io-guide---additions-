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
import { emotes } from "./emote/index.js";
import messagePreProcess from "./messagePreProcess.js";
import musicPlayer from "./musicPlayer.js";
import imageLibrary from "./imageLibrary.js";
// @ts-ignore
// ignored because io() is imported with the html file, not here
export let socket = io();
// @ts-ignore
window.socket = socket;
export let form = document.getElementById('form');
export let input = document.getElementById('input');
export let messagesDiv = document.querySelector('.messages');
let embedPdfDiv = document.querySelector("#pdfviewer");
export let popupContainer = document.querySelector(".popupContainer");
export let currentUser;
export let messages = [];
let inputHistory = (() => {
    let list = [];
    let add = (msg) => { list.push(msg); pointer = list.length - 1; };
    let remove = (msg) => { list.filter(m => m !== msg); pointer = list.length - 1; };
    let pointer = -1;
    let changeInput = (dir) => {
        if (dir === "up" && list[pointer]) {
            input.value = list[pointer];
            pointer -= 1;
        }
        else if (dir === "down" && list[pointer + 1]) {
            pointer += 1;
            input.value = list[pointer];
        }
        else
            input.value = "";
    };
    return { add, remove, changeInput };
})();
form.addEventListener("submit", e => {
    e.preventDefault();
    if (input.value.length !== 0 && /\S/.test(input.value)) {
        if (messagePreProcess(input.value)) {
            socket.emit(!currentUser ? "messageFirst" : "message", input.value, currentUser, replyFormSwitch.message);
            formSwitchReset();
        }
        inputHistory.add(input.value);
    }
    refreshFields();
});
socket.on("initUser", (user) => {
    if (!emotes.isInited)
        emotes.init();
    currentUser = user;
    // let musicPlayer = new Audio()
    // musicPlayer.src = `./audio/saul.opus`
    // musicPlayer.play()
    // musicPlayer.loop = true
});
socket.on("message", (message, type) => {
    messages.push(message);
    messageConstructor(message, currentUser, type);
    if (message.isImage)
        imageLibrary.add(message);
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
    imageLibrary.remove(desiredMessage);
    messages = messages.filter(mes => mes.id !== message.id);
});
socket.on("dis", () => {
    socket.disconnect(true);
});
socket.on("visibilityCheck", (val) => {
    if (!currentUser)
        return;
    else if (!val)
        socket.emit("visibilityCheck", document.visibilityState, currentUser);
    else
        messageConstructor(val, currentUser);
});
socket.on("openPdf", (pdfFile) => {
    // @ts-ignore
    PDFObject.embed(`./pdf/${pdfFile}`, embedPdfDiv);
    popupContainer.classList.add("visible");
    document.getElementById("pdfviewer").classList.add("visible");
});
window.addEventListener("keyup", e => {
    switch (e.key) {
        case "Escape":
            popupContainer.classList.remove("visible");
            document.getElementById("pdfviewer").classList.remove("visible");
            break;
        case "ArrowUp":
            inputHistory.changeInput("up");
            break;
        case "ArrowDown":
            inputHistory.changeInput("down");
            break;
        case "ArrowLeft":
            imageLibrary.move("up");
            break;
        case "ArrowRight":
            imageLibrary.move("down");
            break;
    }
});
musicPlayer();
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
let adminPurge = (code) => socket.emit("adminPurge", code);
// @ts-ignore
window.adminPurge = adminPurge;
let adminLogin = (code) => socket.emit("adminLogin", code);
// @ts-ignore
window.adminLogin = adminLogin;
socket.on("adminPurge", () => location.reload());
