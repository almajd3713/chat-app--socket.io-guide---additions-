import * as util from "./util.js"
import {Message, User} from "./classes.js"
import { messageConstructor, messageDir, replyFormSwitch } from "./constructor.js"
import type { Socket } from "socket.io";
import { emotes } from "./emote/index.js";
import messagePreProcess from "./messagePreProcess.js";
import type * as PDFObject from "pdfobject";
import musicPlayer from "./musicPlayer.js";
import imageLibrary from "./imageLibrary.js";

// @ts-ignore
// ignored because io() is imported with the html file, not here
export let socket: Socket = io()
// @ts-ignore
window.socket = socket
export let form = document.getElementById('form') as HTMLFormElement;
export let input = document.getElementById('input') as HTMLInputElement;
export let messagesDiv = document.querySelector('.messages')!;
let embedPdfDiv = document.querySelector("#pdfviewer") as HTMLElement
export let popupContainer = document.querySelector(".popupContainer") as HTMLElement
export let currentUser: User
export let messages: Message[] = []
let inputHistory = (() => {
  let list: string[] = []
  let add = (msg: string) => {list.push(msg); pointer = list.length - 1}
  let remove = (msg: string) => { list.filter(m => m !== msg); pointer = list.length - 1}
  let pointer: number = -1
  let changeInput = (dir: "up" | "down") => {
    if(dir === "up" && list[pointer]) {
      input.value = list[pointer]
      pointer -= 1
    } else if (dir === "down" && list[pointer + 1]) {
      pointer += 1
      input.value = list[pointer]
    } else input.value = ""
  }
  return {add, remove, changeInput}
})()
form.addEventListener("submit", e => {
  e.preventDefault()
  if(input.value.length !== 0 && /\S/.test(input.value)) {
    if(messagePreProcess(input.value)) {
      socket.emit(
        !currentUser ? "messageFirst" : "message",
        input.value,
        currentUser,
        replyFormSwitch.message
      )
      formSwitchReset()
    }
    inputHistory.add(input.value)
  }
  refreshFields()
})

socket.on("initUser", (user: User) => {
  if(!emotes.isInited) emotes.init()
  currentUser = user
  // let musicPlayer = new Audio()
  // musicPlayer.src = `./audio/saul.opus`
  // musicPlayer.play()
  // musicPlayer.loop = true
})

socket.on("message", (message: Message, type: messageDir) => {
  messages.push(message)
  messageConstructor(message, currentUser, type)
  if(message.isImage) imageLibrary.add(message)
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
  imageLibrary.remove(desiredMessage)
  
  messages = messages.filter(mes => mes.id !== message.id);
})

socket.on("dis", () => {
  socket.disconnect(true)
})

socket.on("visibilityCheck", (val: false | Message) => {
  if(!currentUser) return;
  else if(!val) socket.emit("visibilityCheck", document.visibilityState, currentUser)
  else messageConstructor(val, currentUser)
})

socket.on("openPdf", (pdfFile: string) => {
  // @ts-ignore
  PDFObject.embed(`./pdf/${pdfFile}`, embedPdfDiv)
  popupContainer.classList.add("visible")
  document.getElementById("pdfviewer")!.classList.add("visible")
})
window.addEventListener("keyup", e => {
  switch (e.key) {
    case "Escape":
      popupContainer.classList.remove("visible")
      document.getElementById("pdfviewer")!.classList.remove("visible")
      break;
    case "ArrowUp":
      inputHistory.changeInput("up")
      break;
    case "ArrowDown":
      inputHistory.changeInput("down")
      break;
    case "ArrowLeft":
      imageLibrary.move("up")
      break;
    case "ArrowRight":
      imageLibrary.move("down")
      break;
  }
})
musicPlayer()
let viewportCheck = (el: HTMLElement) => {
  let messageArr = Array.from(messagesDiv.children)
  let viewportCheckMessage = messageArr[messageArr.indexOf(el)] as HTMLElement
  if(viewportCheckMessage && util.isInViewport(viewportCheckMessage)) {
    el.scrollIntoView()
  }
}

let formSwitchReset = () => {
  if(replyFormSwitch.message) {
    ((replyFormSwitch.message as Message).messageStructure as HTMLElement).style.backgroundColor = (replyFormSwitch.message as Message).color
    replyFormSwitch.message = false
  }
}

let refreshFields = () => {
  input.value = ""
  input.placeholder = ""
}

document.addEventListener("paste", async(e) => {
  if(!currentUser) return;
  let a = e.clipboardData!.files[0]
  if(a) {
    let img = await a.arrayBuffer()
    socket.emit("message", `Sent an image: `, currentUser, replyFormSwitch.message, img)
    formSwitchReset()
  }
})

let adminPurge = (code: string) => socket.emit("adminPurge", code)
// @ts-ignore
window.adminPurge = adminPurge
let adminLogin = (code: string) => socket.emit("adminLogin", code)
// @ts-ignore
window.adminLogin = adminLogin
socket.on("adminPurge", () => location.reload())