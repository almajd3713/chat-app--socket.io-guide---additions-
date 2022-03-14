
export class Message {
  constructor(messageObject) {
    this.content = messageObject.content
    this.user = messageObject.user
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
  }
}