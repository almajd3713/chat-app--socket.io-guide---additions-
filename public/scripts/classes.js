
export class Message {
  constructor(messageObject) {
    this.id = messageObject.id
    this.content = messageObject.content
    this.user = messageObject.user
    this.messageStructure;
    this.isImage = messageObject.isImage;
    this.image = messageObject.image
    this.replyTo = false;
  }
  auth(user) {
    if(user === this.user.Id) return true
    else return true
  }
}

export class User {
  constructor(userObject) {
    this.username = userObject.username
    this.userId = userObject.userId
    this.color = userObject.color
  }
}