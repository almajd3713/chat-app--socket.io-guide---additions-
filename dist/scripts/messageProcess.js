import { emotes } from "./emote/index.js";
import { currentUser } from "./index.js";
export default (message) => {
    let newMessage = `${message.content} ${message.isEdited ? "(edited)" : ""}`;
    let emotesInMessage = newMessage.match(/(:\S*:)/g);
    if (emotesInMessage) {
        emotesInMessage.forEach(emo => {
            let emote = emotes.find(emo);
            if (emote) {
                let regex = new RegExp(emo, "g");
                newMessage = newMessage.replace(regex, `<img src="scripts/emote/${emote.content}" class="emote"/>`);
            }
        });
    }
    let mentions = newMessage.match(/@\w*/g);
    if (mentions) {
        mentions.forEach(mention => {
            if (currentUser.username === mention.slice(1)) {
                message.messageStructure.style.backgroundColor = "#f8abe7";
            }
            newMessage = newMessage.replace(new RegExp(mention, "g"), `<span style="color: #1295ba">${mention}</span>`);
        });
    }
    return newMessage;
};
