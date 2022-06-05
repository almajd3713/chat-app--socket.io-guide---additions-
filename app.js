// this is an es6 file, code below is to allow for CommonJS require and __dirname
import {createRequire} from "module"
const require = createRequire(import.meta.url)
import {dirname} from "path"
const bodyParser = require("body-parser")
import {fileURLToPath} from "url"
import {fileTypeFromBuffer} from "file-type"
const __dirname = dirname(fileURLToPath(import.meta.url))
// end of fix

import express from "express"
let app = express()
let port = process.env.PORT || 3000

import {Server} from "socket.io"

app.use(express.static(`${__dirname}/dist`))
app.use(bodyParser.raw({type: "image/*"}))
app.use(express.json())


app.get("/", (req, res) => {
  res.sendFile("")
})
// app.post("/", (req, res) => {
//   let oldData = JSON.parse(fs.readFileSync("./dist/images/imageData.json"))
//   oldData.push(req.body)
//   fs.writeFileSync("./dist/images/imageData.json", JSON.stringify(oldData))
//   res.sendStatus(200)
// })

let server = app.listen(port, () => console.log("listening on *:3000"))
let io = new Server(server)


// let messagePOST = (message) => {
//   let database = JSON.parse(fs.readFileSync("./dist/database.json"))
//   database.push([message.user.userId, message.content])
//   fs.writeFileSync("./dist/database.json", JSON.stringify(database))
// }
// let messageGET = () => {
//   let database = JSON.parse(fs.readFileSync("./dist`/database.json"))
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

import {Message, User} from "./dist/scripts/classes.js"

let onlinePeople = (() => {
  let list = []
  let add = (user) => list.push(user)
  let remove = (user) => list = list.filter(u => u.userId !== user.userId)
  let find = (userId) => list.find(u => u.userId === userId)
  return {list, find, add, remove}
})()
onlinePeople.add(new User({
  username: "Server",
  userId: "AAAAAAAAAAAA",
  color: "#555"
}))
let messages = []

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
    id = id + str[Math.ceil(Math.random() * 36)]
  }
  return id
}

io.on("connection", (socket) => {
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
      user: onlinePeople.find("AAAAAAAAAAAA"), 
      id: idGen(), 
      messageStructure: false, 
      isNotif: [true, "hi"]
    })
    messages.push(message)
    socket.emit("initUser", user)
    io.emit("message", message, "other")
  })
  socket.on("message", (data, user, replyMessage) => {
    let message = new Message({
      content: data, user: user, 
      id: idGen(), messageStructure: false, 
      isReply: replyMessage ? replyMessage : false
    })
    messages.push(message)
    socket.emit("message", message, "self")
    socket.broadcast.emit("message", message, "other")
  })
  
  // socket.on("typing", () => {
  //   socket.broadcast.emit("typing", socket.data.user)
  // })

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

  // socket.on("purgeAdmin", password => {
  //   if(password === "galung2020") {
  //     messages = []
  //     io.emit("purgeStatus", true)
  //   } else {
  //     socket.emit("purgeStatus", false)
  //   }
  // })

  // socket.on("imageSend", (buffer, user) => {
  //   let message = new Message({
  //     isImage: true,
  //     image: buffer,
  //     user: user,
  //     id: idGen()
  //   })
  //   messages.push(message)
  //   socket.emit("messageAdmin", message)
  //   socket.broadcast.emit("message", message)
  // })

  // socket.on("kickPerson", (password, user => {
  //   if(password === "galung2020") {
  //     let desiredUser = onlinePeople.find(person => person.username === user)
  //     if(desiredUser) socket.emit("discon")
  //   }
  // }))
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
        user: onlinePeople.find("AAAAAAAAAAAA"),
        isNotif: [true, "promotion"],
        id: idGen()
      }), "other")
    }
  })

  socket.on("disconnect", () => {
    if(socket.data.user) {
      let message = new Message({
        content: `${socket.data.user.username} has left us, how sedj :(`,
        user: onlinePeople.find("AAAAAAAAAAAA"),
        id: idGen(),
        isNotif: [true, "fi"]
      })  
      messages.push(message)
      io.emit("message", message, "other")
      onlinePeople.remove(socket.data.user)
    }
  })
})