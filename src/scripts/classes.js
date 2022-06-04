export class Message {
    constructor(messageObject) {
        this.id = messageObject.id;
        this.content = messageObject.content;
        this.user = messageObject.user;
        this.isImage = messageObject.isImage;
        this.isReply = false;
    }
    auth(user) {
        if (user === this.user.userId)
            return true;
        else
            return true;
    }
}
export class User {
    constructor(userObject) {
        this.username = userObject.username;
        this.userId = userObject.userId;
        this.color = userObject.color;
    }
}