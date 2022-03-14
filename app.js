// this is an es6 file, code below is to allow for CommonJS require and __dirname
import {createRequire} from "module"
const require = createRequire(import.meta.url)
import {dirname} from "path"
import {fileURLToPath} from "url"
const __dirname = dirname(fileURLToPath(import.meta.url))
// end of fix

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

let onlinePeople = []
let messages = []
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
  socket.on("messageFirst", (data) => {
    let user = new User({
      username: data,
      userId: socket.id
    })
    let onlinePeopleList = welcomeMessageBuild()
    onlinePeople.push(user)
    io.emit("hi", `${user.username} has joined !`, onlinePeopleList)
    socket.emit("initUser", user)
  })
  socket.on("disconnect", () => io.emit("fi", socket.username !== "" ? socket.username : "someone"))
  socket.on("message", (data, user) => {
    let message = new Message({content: data, user: user})
    messages.push(message)
    socket.emit("messageAdmin", message)
    socket.broadcast.emit("message", message)
  })
  
  socket.on("typing", () => {
    socket.broadcast.emit("typing", socket.username)
  })
})
