import { currentUser, socket } from "./index.js";
import { Message } from "./classes";

export default (message: string) => {
  if(!currentUser) return true
  let bool: boolean = true
  let newMessage = message
  let textTrigger = (trigger: string, callback: (item: string) => void) => {
    let textQueue = newMessage.match(new RegExp(trigger))
    if (textQueue) {
      callback(textQueue[0])
    }
  }
  
  textTrigger("(/\\w*)\\s?(.*[^\\s*])?", (command: string) => {
    let args = command.split(" ")
    switch (args[0].slice(1)) {
      case "listPeople":
        socket.emit("chatCommand", "notifListPeople")
        bool = false
        break
      case "setColor":
        if(colorHexRegExp.test(args[1])) {
          console.log(args[1])
        socket.emit("chatCommand", "setColor", [currentUser.userId, args[1]])
        } else {
          socket.emit("chatCommand", "notification", "You didn't send a valid color ! send only hex or rgb colors.")
        }
        bool = false
        break
      default:
        socket.emit("chatCommand", "notification", "this command is not valid !")
        bool = false
    }
  })
  return bool
}

let colorHexRegExp = /(#([0-9A-Fa-f]{3,6})\b)|(aqua)|(black)|(blue)|(fuchsia)|(gray)|(green)|(lime)|(maroon)|(navy)|(olive)|(orange)|(purple)|(red)|(silver)|(teal)|(white)|(yellow)|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\))/g