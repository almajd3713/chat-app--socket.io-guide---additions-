
interface MessageStructure {
  id: string
  content:string
  user: User
  messageStructure: HTMLElement | boolean
  isImage: boolean | string
  isReply: boolean | Message
  isNotif: [is: boolean, type: string]
}
interface UserStructure {
  username: string
  userId: string
  color: string
}
export class Message implements MessageStructure{
  id: string
  content: string
  user: User
  messageStructure: boolean | HTMLElement = false
  isImage: boolean | string
  isReply: boolean | Message = false
  isNotif: [is: boolean, type: string] = [false, ""]
  constructor(messageObject: MessageStructure) {
    this.id = messageObject.id
    this.content = messageObject.content
    this.user = messageObject.user
    this.isImage = messageObject.isImage;
    this.isNotif = messageObject.isNotif
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