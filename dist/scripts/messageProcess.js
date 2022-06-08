import { emotes } from "./emote/index.js";
import { currentUser } from "./index.js";
export default (message) => {
    let newMessage = `${message.content} ${message.isEdited ? "(edited)" : ""}`;
    let textChange = (trigger, callback) => {
        let textQueues = newMessage.match(new RegExp(trigger, "g"));
        console.log(textQueues);
        if (textQueues) {
            textQueues.forEach(q => {
                newMessage = newMessage.replace(new RegExp(q, ""), callback(q));
            });
        }
    };
    //! emotes
    textChange("(:\\S*:)", (emo) => {
        let emote = emotes.find(emo);
        if (emote)
            return `<img src="scripts/emote/${emote.content}" class="emote"/>`;
        else
            return emo;
    });
    //! mention
    textChange("@\\w*", (mention) => {
        if (currentUser.username === mention.slice(1)) {
            message.messageStructure.style.backgroundColor = "#f8abe7";
            return `<span style="color: #1295ba">${mention}</span>`;
        }
        else
            return mention;
    });
    return newMessage;
};
