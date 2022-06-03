import io from "socket.io-client";
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
});
let refreshFields = () => {
    input.value = "";
    input.placeholder = "";
};
