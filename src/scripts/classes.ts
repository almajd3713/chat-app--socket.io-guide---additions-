
interface MessageStructure {
  id: string
  content: string
  user: User
  messageStructure: HTMLElement | false
  isImage: false | string
  isReply: false | Message
  isNotif: [is: boolean, type: string]
  isEdited: boolean
  color: string

}
interface UserStructure {
  username: string
  userId: string
  color: string
}

export class Message implements MessageStructure {
  id: string
  content: string = ""
  color: string = "white"
  user: User
  messageStructure: false | HTMLElement = false
  isImage: false | string
  isReply: false | Message = false
  isNotif: [is: boolean, type: string] = [false, ""]
  isEdited: boolean = false
  constructor(messageObject: MessageStructure) {
    this.id = messageObject.id
    this.content = messageObject.content
    this.user = messageObject.user
    this.isImage = messageObject.isImage;
    this.isNotif = messageObject.isNotif
    this.isReply = messageObject.isReply
  }
  auth(user: User["userId"]) {
    if(user === this.user.userId) return true
    else return true
  }
}

export class User implements UserStructure{
  constructor(userObject: UserStructure) {
    this.username = userObject.username
    this.userId = userObject.userId
    this.color = userObject.color
  }
  username: string
  userId: string
  color: string
}


interface emoteStructure {
  prefix: string
  type: "emoji" | "custom"
  content: string
}
export class Emote implements emoteStructure {
  prefix: string
  type: "emoji" | "custom"
  content: string
  constructor(emoteStruct: emoteStructure) {
    this.prefix = emoteStruct.prefix
    this.type = emoteStruct.type
    this.content = emoteStruct.content
  }
}