
let express = require("express")
let app = express()
let port = process.env.PORT

let {Server} = require("socket.io")

app.use(express.static(`${__dirname}/public`))

app.get("/", (req, res) => {
  res.sendFile()
})

let server = app.listen(port, () => console.log("listening on *:3000"))
let io = new Server(server)

let onlinePeople = []
let welcomeMessageBuild = () => {
  let str = `Welcome ! there ${onlinePeople.length >= 2 ? "are" : "is"} ${onlinePeople.length} people online. ` 
  if(onlinePeople.length) {
    onlinePeople.forEach((person, i, arr) => {
    let tempStr = `"${person}"`
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
  socket.username = ""
  socket.on("messageFirst", (data) => {
    socket.username = data
    let onlinePeopleList = welcomeMessageBuild()
    onlinePeople.push(data)
    io.to(socket.id).emit("hi", `${socket.username} has joined !`, onlinePeopleList)
  })
  socket.on("disconnect", () => io.emit("fi", socket.username !== "" ? socket.username : "someone"))
  socket.on("message", (data) => {
    socket.broadcast.emit("message", `${socket.username}: ${data}`)
  })
  
  socket.on("typing", () => {
    socket.broadcast.emit("typing", socket.username)
  })
})
