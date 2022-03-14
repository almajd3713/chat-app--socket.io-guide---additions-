
alright so we shalt provide the basic functionality: the messaging. to do that, use this:
```js
let express = require("express")
let app = express()
app.use(express.static(`${__dirname}/public`))
app.get("/", (req, res) => {
  res.sendFile()
})
app.listen(3000)
```
with an html file like the one in the `/public` dir. now add socket.io and init it in the app file:
```js
let {Server} = require("socket.io")
let server = app.listen(3000)
let io = new Server(server)
```
> `app.listen` returns an http server, which io can use

