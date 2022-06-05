import * as util from "./util.js"
import {Message, User} from "./classes.js"
import { messageConstructor, messageDir } from "./constructor.js"
import type { Socket } from "socket.io";

// @ts-ignore
// ignored because io() is imported with the html file, not here
let socket: Socket = io()
let form = document.getElementById('form') as HTMLFormElement;
let input = document.getElementById('input') as HTMLInputElement;
let messagesDiv = document.querySelector('.messages')!;
let currentUser: User
let messages: Message[]
let replySwitch: boolean = false

form.addEventListener("submit", e => {
  e.preventDefault()
  socket.emit(
    !currentUser ? "messageFirst" : "message",
    input.value,
    currentUser
  )
  refreshFields()
})

socket.on("loadOldMessage", message => {
  messagesDiv.appendChild(messageConstructor(message, "other"))
})
socket.on("initUser", (user: User) => {
  currentUser = user
})

socket.on("message", (message: Message, type: messageDir) => {
  message.messageStructure = messageConstructor(message, type)
  messagesDiv.appendChild(message.messageStructure)
})




let refreshFields = () => {
  input.value = ""
  input.placeholder = ""
}