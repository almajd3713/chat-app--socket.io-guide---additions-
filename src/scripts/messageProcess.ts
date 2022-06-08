import { Message } from "./classes"
import { emotes } from "./emote/index.js"
import { currentUser } from "./index.js"
export default (message: Message) => {
  let newMessage: string = `${message.content} ${message.isEdited ? "(edited)" : ""}`
  let textChange = (trigger: string, callback: (item: string) => string) => {
    let textQueues = newMessage.match(new RegExp(trigger, "g"))
    console.log(textQueues)
    if(textQueues) {
      textQueues.forEach(q => {
        newMessage = newMessage.replace(new RegExp(q, ""), callback(q))
      })
    }
  }
  //! emotes
  textChange("(:\\S*:)", (emo: string) => {
    let emote = emotes.find(emo)
    if (emote) return `<img src="scripts/emote/${emote.content}" class="emote"/>`
    else return emo
  })

  //! mention
  textChange("@\\w*", (mention: string) => {
    if(currentUser.username === mention.slice(1)) {
      (message.messageStructure as HTMLElement).style.backgroundColor = "#f8abe7"
      return `<span style="color: #1295ba">${mention}</span>`
    } else return mention
  })
  
  return newMessage
}

