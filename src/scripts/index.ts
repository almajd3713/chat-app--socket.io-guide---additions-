import * as util from "./util.js"
import {Message, User} from "./classes.js"
import { messageConstructor, messageDir, replyFormSwitch } from "./constructor.js"
import type { Socket } from "socket.io";

// @ts-ignore
// ignored because io() is imported with the html file, not here
export let socket: Socket = io()
// @ts-ignore
window.socket = socket
export let form = document.getElementById('form') as HTMLFormElement;
export let input = document.getElementById('input') as HTMLInputElement;
export let messagesDiv = document.querySelector('.messages')!;
export let currentUser: User
export let messages: Message[] = []

form.addEventListener("submit", e => {
  e.preventDefault()
  if(input.value.length !== 0 && /\S/.test(input.value)) {
    socket.emit(
      !currentUser ? "messageFirst" : "message",
      input.value,
      currentUser,
      replyFormSwitch.message
    )
    if (replyFormSwitch.message) {
      ((replyFormSwitch.message as Message).messageStructure as HTMLElement).style.backgroundColor = (replyFormSwitch.message as Message).color
      replyFormSwitch.message = false
    }
  }
  refreshFields()
})

socket.on("initUser", (user: User) => {
  currentUser = user
})

socket.on("message", (message: Message, type: messageDir) => {
  messages.push(message)
  messageConstructor(message, currentUser, type)
  viewportCheck(message.messageStructure as HTMLElement)
})

socket.on("edit", (message: Message) => {
  let desiredMessage = messages.find(mes => mes.id === message.id)!
  desiredMessage.content = message.content;
  (desiredMessage.messageStructure as HTMLElement).querySelector(".messageText")!.textContent = `${message.content} ${message.isEdited ? "(edited)" : ""}`
})

socket.on("delete", (message: Message) => {
  let desiredMessage = messages.find(mes => mes.id === message.id)!;
  (desiredMessage.messageStructure as HTMLElement).remove()
  messages = messages.filter(mes => mes.id !== message.id);
})









let viewportCheck = (el: HTMLElement) => {
  let messageArr = Array.from(messagesDiv.children)
  let viewportCheckMessage = messageArr[messageArr.indexOf(el) - 2] as HTMLElement
  if(viewportCheckMessage && util.isInViewport(viewportCheckMessage)) {
    el.scrollIntoView()
  }
}



let refreshFields = () => {
  input.value = ""
  input.placeholder = ""
}