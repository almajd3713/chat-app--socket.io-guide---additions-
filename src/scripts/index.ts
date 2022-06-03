import * as util from "./util"
import {Message, User} from "./classes"
import {messageConstructor} from "./constructor"
import io from "socket.io-client"

let socket = io()
let form = document.getElementById('form') as HTMLFormElement;
let input = document.getElementById('input') as HTMLInputElement;
let messagesDiv = document.querySelector('.messages');
let currentUser: User
let messages: Message[]

form.addEventListener("submit", e => {
  e.preventDefault()
  socket.emit(
    currentUser ? "message" : "messageFirst",
    input.value,
    currentUser
  )
})

socket.on("initUser", (user: User) => {
  currentUser = user
  refreshFields()
})

socket.on("message", (message: Message) => {
  
})




let refreshFields = () => {
  input.value = ""
  input.placeholder = ""
}