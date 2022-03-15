// this is an es6 file, code below is to allow for CommonJS require and __dirname
import {createRequire} from "module"
const require = createRequire(import.meta.url)
import {dirname} from "path"
import {fileURLToPath} from "url"
const __dirname = dirname(fileURLToPath(import.meta.url))
// end of fix
import fs from "fs"

import {User, Message} from "./public/classes.js"
let express = require("express")
let app = express()
let port = process.env.PORT || 3000


let {Server} = require("socket.io")

app.use(express.static(`${__dirname}/public`))

app.get("/", (req, res) => {
  res.sendFile()
})

let server = app.listen(port, () => console.log("listening on *:3000"))
let io = new Server(server)

let messagePOST = (message) => {
  let database = JSON.parse(fs.readFileSync("./public/database.json"))
  database.push([message.user.userId, message.content])
  console.log(database)
  fs.writeFileSync("./public/database.json", JSON.stringify(database))
}
// let messageGET = (socket) => {
//   let database = JSON.parse(fs.readFileSync("./public/database.json"))
//   database.forEach(item => {
//     let message =  new Message({
//       content: item[1],
//       user: findUser(item)
//     })
//     socket.emit("message", message)
//   })
// }
// let findUser = (item) => {
//   let person = onlinePeople.find(entity => item[0] === entity.user.userId)
//   if(person) return person
//   else return new User({username: `${item[0]} (offline)`, color: "#000", userId: item[0]})
// }

let onlinePeople = []
let messages = []
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
  messages.forEach(message => {
    socket.emit("message", message)
  })
  // messageGET(socket)
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
})
