// this is an es6 file, code below is to allow for CommonJS require and __dirname
import {createRequire} from "module"
const require = createRequire(import.meta.url)
import {dirname} from "path"
const bodyParser = require("body-parser")
import {fileURLToPath} from "url"
import {fileTypeFromBuffer} from "file-type"
const __dirname = dirname(fileURLToPath(import.meta.url))
// end of fix
import fs from "fs"

import {User, Message} from "./public/classes.js"
let express = require("express")
let app = express()
let port = process.env.PORT || 3000

let {Server} = require("socket.io")

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.raw({type: "image/*"}))
app.use(express.json())


app.get("/", (req, res) => {
  res.sendFile()
})
app.post("/", (req, res) => {
  let oldData = JSON.parse(fs.readFileSync("./public/images/imageData.json"))
  oldData.push(req.body)
  fs.writeFileSync("./public/images/imageData.json", JSON.stringify(oldData))
  res.sendStatus(200)
})

let server = app.listen(port, () => console.log("listening on *:3000"))
let io = new Server(server)

// let messagePOST = (message) => {
//   let database = JSON.parse(fs.readFileSync("./public/database.json"))
//   database.push([message.user.userId, message.content])
//   fs.writeFileSync("./public/database.json", JSON.stringify(database))
// }
// let messageGET = () => {
//   let database = JSON.parse(fs.readFileSync("./public/database.json"))
//   let messages = database.map(data => {
//     return new Message({
//       content: data[1],
//       user: findUser(data[0])
//     })
//   })
//   return messages
// }
// let findUser = (id) => {
//   let user = onlinePeople.find(person => person.userId === id)
//   if(user) return user
//   else return new User({
//     username: `${id.substr(0, 5)} (offline)`,
//     id: id,
//     color: "#000"
//   })
// }

let messages = []
let onlinePeople = []
let colorPicker = () => {
  let colors = ["#C51D34", "#8A6643", "#3E5F8A", "#C93C20", "#00BB2D", "#EA899A", "#063971", "#C6A664", "#84C3BE", "#382C1E"]
  return colors[Math.ceil(Math.random() * colors.length - 1)]
}
let welcomeMessageBuild = () => {
  let str = `Welcome ! there ${onlinePeople.length >= 2 ? "are" : "is"} ${onlinePeople.length} people online. ` 
  if(onlinePeople.length) {
    onlinePeople.forEach((person, i, arr) => {
    let tempStr = `"${person.username}"`
    if(arr[i + 1]) {
      tempStr = `${tempStr}, `
      if(!arr[i + 2]) tempStr = `${tempStr} and `
    } else {
      tempStr = `${tempStr}.`
    }
    str = str + tempStr
  })
  }
  return str
}

io.on("connection", (socket) => {
  // messageGET(socket)
  messages.forEach(message => {
    socket.emit("message", message)
  })
  socket.on("messageFirst", (data) => {
    let user = new User({
      username: data,
      userId: socket.id,
      color: colorPicker()
    })
    socket.user = user
    let onlinePeopleList = welcomeMessageBuild()
    onlinePeople.push(user)
    io.emit("hi", `${user.username} has joined !`, onlinePeopleList)
    socket.emit("initUser", user)
  })
  socket.on("disconnect", () => {
    if(socket.user) {
      io.emit("fi", socket.user)
      onlinePeople = onlinePeople.filter(user => user.userId !== socket.user.userId)
    }
  })
  socket.on("message", (data, user, replyMessage) => {
    let message = new Message({content: data, user: user})
    if(replyMessage) message.replyTo = replyMessage
    messages.push(message)
    // messagePOST(message)
    socket.emit("messageAdmin", message)
    socket.broadcast.emit("message", message)
  })
  
  socket.on("typing", () => {
    socket.broadcast.emit("typing", socket.username)
  })

  socket.on("editSend", (val, message) => {
    let desiredMessage = messages.find(mes => mes.content === message.content && mes.user.userId === message.user.userId)
    desiredMessage.content = val
    socket.broadcast.emit("editReceive", val, message)
  })

  socket.on("purgeAdmin", password => {
    if(password === "galung2020") {
      messages = []
      io.emit("refresh")
      socket.emit("purgeStatus", true)
    } else {
      io.emit("purgeStatus", false)
    }
  })

  socket.on("imageSend", (buffer, user) => {
    let message = new Message({
      isImage: true,
      image: buffer,
      user: user,
    })
    messages.push(message)
    socket.emit("messageAdmin", message)
    socket.broadcast.emit("message", message)
  })
})
