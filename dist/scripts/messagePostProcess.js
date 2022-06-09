import { emotes } from "./emote/index.js";
import { currentUser } from "./index.js";
export default (message) => {
    let newMessage = `${message.content} ${message.isEdited ? "(edited)" : ""}`;
    let textChange = (trigger, callback) => {
        let textQueues = newMessage.match(new RegExp(trigger, "g"));
        if (textQueues) {
            textQueues.forEach(q => {
                let regex = new RegExp(q
                    .replace("\*", "\\*"));
                newMessage = newMessage.replace(regex, callback(q));
            });
        }
    };
    //! emotes
    textChange("(:\\S*:)", (emo) => {
        let emote = emotes.find(emo);
        if (emote)
            return emote.type === "emoji" ? `<span class="emote">${emote.content}</span>` : `<img src="scripts/emote/${emote.content}" class="emote"/>`;
        else
            return emo;
    });
    //! mention
    textChange("@\\w*", (mention) => {
        if (currentUser && currentUser.username === mention.slice(1)) {
            message.messageStructure.style.backgroundColor = "#f8abe7";
        }
        return `<span style="color: #1295ba">${mention}</span>`;
    });
    //! bold
    textChange("\\*.[^\\*]*\\*", (bold) => {
        return `<span style="font-weight: bold">${bold.slice(1, bold.length - 1)}</span>`;
    });
    //! line break
    return newMessage;
};
export let replyPostProcess = (reply) => {
    let newReply = reply;
    newReply = newReply.replace(/(:\S*:)/g, "");
    return newReply;
};
