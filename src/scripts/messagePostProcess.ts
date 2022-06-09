import { Message } from "./classes"
import { emotes } from "./emote/index.js"
import { currentUser } from "./index.js"
export default (message: Message) => {
  let newMessage: string = `${message.content} ${message.isEdited ? "(edited)" : ""}`
  let textChange = (trigger: string, callback: (item: string) => string) => {
    let textQueues = newMessage.match(new RegExp(trigger, "g"))
    if(textQueues) {
      textQueues.forEach(q => {
        let regex = new RegExp(q
          .replace("\*", "\\*")
        )
        newMessage = newMessage.replace(regex, callback(q))
      })
    }
  }
  //! emotes
  textChange("(:\\S*:)", (emo: string) => {
    let emote = emotes.find(emo)
    if (emote) return emote.type === "emoji" ? `<span class="emote">${emote.content}</span>` : `<img src="scripts/emote/${emote.content}" class="emote"/>`
    else return emo
  })

  //! mention
  textChange("@\\w*", (mention: string) => {
    if(currentUser && currentUser.username === mention.slice(1)) {
      (message.messageStructure as HTMLElement).style.backgroundColor = "#f8abe7"
    } return `<span style="color: #1295ba">${mention}</span>`
  })

  //! bold
  textChange("\\*.[^\\*]*\\*", (bold: string) => {
    return `<span style="font-weight: bold">${bold.slice(1, bold.length - 1)}</span>`
  })
  
  //! line break
  return newMessage
}

export let replyPostProcess = (reply: string) => {
  let newReply: string = reply
  newReply = newReply.replace(/(:\S*:)/g, "")
  return newReply
}