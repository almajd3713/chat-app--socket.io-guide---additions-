// this is an es6 file, code below is to allow for CommonJS require and __dirname
import {createRequire} from "module"
const require = createRequire(import.meta.url)
import {dirname} from "path"
const bodyParser = require("body-parser")
import {fileURLToPath} from "url"
const __dirname = dirname(fileURLToPath(import.meta.url))
// end of fix

import express from "express"
let app = express()
let port = process.env.PORT || 3000

import {Server} from "socket.io"

import fs from "fs"
let kickImage = fs.readFileSync("./dist/style/mucho.jpg")

app.use(express.static(`${__dirname}/dist`))
app.use(bodyParser.raw({type: "image/*"}))
app.use(express.json())



app.get("/", (req, res) => {
  res.sendFile("")
})

let server = app.listen(port, () => console.log("listening on *:3000"))
let io = new Server(server)

import {Message, User} from "./dist/scripts/classes.js"

let onlinePeople = (() => {
  let list = []
  let add = (user) => list.push(user)
  let remove = (user) => list = list.filter(u => u.userId !== user.userId)
  let find = (userId) => list.find(u => u.userId === userId)
  let findByName = (username) => list.find(u => u.username === username)
  return {list, find, add, remove, findByName}
})()
let serverUser = (new User({
  username: "Server",
  userId: "AAAAAAAAAAAA",
  color: "#555"
}))
let messages = []
let socketList = []
let visiblePeople = []

let colorPicker = () => {
  let colors = [
    "#C51D34", "#8A6643", "#3E5F8A", "#C93C20", "#00BB2D", "#EA899A", "#063971", "#C6A664", "#84C3BE", "#382C1E", "#BCC682", "#9FF33B", "#4285CE", "#94B2E3", "#5D2258", "#9CA9A9", "#FEEA7A", "#D9B8BD", "#6134D1", "#84F3B3", "#B83723", "#5E5FC3", "#433233"
  ]
  return colors[Math.ceil(Math.random() * colors.length - 1)]
}
let idGen = () => {
  let str = "1234567890qwertyuiopasdfghjklzxcvbnm"
  let id = ""
  for(let i = 0; i <= 11; i ++) {
    id = id + str[Math.ceil(Math.random() * 34)]
  }
  return id
}

io.on("connection", (socket) => {
  socketList.push(socket)
  messages.forEach(message => {
    socket.emit("message", message, "other")
  })
  socket.on("messageFirst", (username) => {
    let user = new User({
      username: username,
      userId: socket.id,
      color: colorPicker()
    })
    socket.data.user = user
    onlinePeople.add(user)
    let message = new Message({ 
      content: `${user.username} has joined !`, 
      user: serverUser, 
      id: idGen(), 
      messageStructure: false, 
      isNotif: [true, "hi"]
    })
    messages.push(message)
    socket.emit("initUser", user)
    io.emit("message", message, "other")
  })

  socket.on("message", (data, user, replyMessage, image) => {
    let message = new Message({
      content: data, user: user, 
      id: idGen(), messageStructure: false, 
      isReply: replyMessage
    })
    if(image) {
      message.isImage = image
    }
    messages.push(message)
    socket.emit("message", message, "self")
    socket.broadcast.emit("message", message, "other")
  })


  socket.on("edit", (id, change) => {
    let desiredMessage = messages.find(mes => mes.id === id)
    desiredMessage.content = change
    desiredMessage.isEdited = true
    io.emit("edit", desiredMessage)
  })

  socket.on("delete", message => {
    messages = messages.filter(mes => mes.id !== message.id)
    io.emit("delete", message)
  })

  socket.on("adminKick", (password, user) => {
    if(password === "galung2020") {
      let desiredUser = onlinePeople.findByName(user)
      if(desiredUser) {
        let s = socketList.find(sock => sock.id === desiredUser.userId)
        if(s) {
          s.emit("message", new Message({
            content: "Muchas Gracias por joderte Idiota",
            user: serverUser,
            isNotif: ["true", "kick"],
            isImage: kickImage
          }), "other")
          s.emit("dis")
        }
      }
    }
  })
  socket.on("adminLogin", code => {
    let isAdmin = false
    let secret = ["g41ung4"]
    secret.forEach(pw => {
      if(pw === code) isAdmin = true
    })
    if(isAdmin) {
      socket.emit("adminLogin")
      socket.emit("message", new Message({
        content: "You are now promoted to an admin !",
        user: serverUser,
        isNotif: [true, "promotion"],
        id: idGen()
      }), "other")
    }
  })


  socket.on("chatCommand", (command, args) => {
    let str = ``
    let letOutput = true
    switch (command) {
      case "notifListPeople":
        str = `Online people are:`
        onlinePeople.list.forEach((person, i, arr) => {
          str = `${str} ${person.username}${arr[i + 1] ? ", " : "."}`
        })
        break;
      case "setColor":
        let user = onlinePeople.find(args[0])
        user.color = args[1]
        socket.emit("initUser", user)
        str = `Color ${args[1]} has been set successfully`
        break;
      case "notification":
        str = args
        break;
      case "viewCheck":
        io.emit("visibilityCheck", false)
        str = `processing request...`
        break;
      case "help":
        str = "Available commands: /listPeople, /setColor COLOR, /listVisible, /help, /viewFile FILE, /listFile"
        break;
      case "openPDF":
        socket.emit("openPdf", args[0])
        letOutput = false
      case "listFiles":
        str = "Available files: chemBersham.pdf"
    }
    if(letOutput) socket.emit("message", new Message({
      content: str,
      user: serverUser,
      isNotif: [true, "command"],
      id: idGen()
    }), "other")
  })
  socket.on("visibilityCheck", (val, user) => {
    if (val === "visible" && !visiblePeople.find(u => u.userId === user.userId)) {
      visiblePeople.push(onlinePeople.find(user.userId))
    }
    else if(val === "hidden" && visiblePeople.find(u => u.userId === user.userId)) {
      visiblePeople = visiblePeople.filter(u => u.userId !== user.userId)
    }
    setTimeout(() => {
      let str = `people viewing site are:`
      visiblePeople.forEach((person, i, arr) => {
        str = `${str} ${person.username}${arr[i + 1] ? ", " : "."}`
      })
      socket.emit("visibilityCheck", new Message({
        content: str,
        user: serverUser,
        id: idGen(),
        isNotif: [true, "command"]
      }))
    }, 1000)
  })
  socket.on("adminMusic", (code, user, song) => {
    if(code === "galung2020") {
      let desiredUser = onlinePeople.findByName(user)
      console.log(desiredUser)
      if(desiredUser) {
        let s = socketList.find(u => u.id === desiredUser.userId)
        if(s) s.emit("adminMusic", song)
      }
    }
  })

  socket.on("disconnect", () => {
    if(socket.data.user) {
      let message = new Message({
        content: `${socket.data.user.username} has left us, how sedj :(`,
        user: serverUser,
        id: idGen(),
        isNotif: [true, "fi"]
      })  
      messages.push(message)
      io.emit("message", message, "other")
      onlinePeople.remove(socket.data.user)
      visiblePeople.filter(u => u.userId !== socket.id)
    }
  })
})