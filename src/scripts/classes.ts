
interface MessageStructure {
  id: string
  content:string
  user: User
  messageStructure:HTMLElement
  isImage: boolean
  image: string
  replyTo: boolean | Message
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
  messageStructure: HTMLElement
  isImage: boolean
  image: string
  replyTo: boolean
  constructor(messageObject: MessageStructure) {
    this.id = messageObject.id
    this.content = messageObject.content
    this.user = messageObject.user
    this.messageStructure;
    this.isImage = messageObject.isImage;
    this.image = messageObject.image
    this.replyTo = false;
  }
  auth(user: User["userId"]) {
    if(user === this.user.userId) return true
    else return true
  }
}

export class User implements UserStructure{
  constructor(userObject) {
    this.username = userObject.username
    this.userId = userObject.userId
    this.color = userObject.color
  }
  username: string
  userId: string
  color: string
}