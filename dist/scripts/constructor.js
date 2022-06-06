import { bufferToBase64, colorIsLight, createNode } from "./util.js";
let parent = document.querySelector(".messages");
import { input, messages, messagesDiv, socket } from "./index.js";
// type modules = "message" | "edit" | "reply" | "image" | "notif"
let isAdmin = false;
// let changeReplyMessage = (() => {
//   let _replyMessage: Message | boolean
//   let setReplyMessage = (newMessage: typeof _replyMessage) => {
//     if (_replyMessage) {
//       ((_replyMessage as Message).messageStructure as HTMLElement).style.backgroundColor = (_replyMessage as Message).color
//       _replyMessage = false
//     }
//     else if(!newMessage) {
//       ((_replyMessage as unknown as Message).messageStructure as HTMLElement).style.backgroundColor = (_replyMessage as unknown as Message).color
//       input.placeholder = ""
//       _replyMessage = false
//     }
//     _replyMessage = newMessage;
//     ((_replyMessage as Message).messageStructure as HTMLElement).style.backgroundColor = "#f8d362"
//     input.placeholder = `replying to ${(_replyMessage as Message).user.username}...`
//   }
//   return {
//     get replyMessage() {
//       if(_replyMessage) return true
//       else return false
//     },
//     set replyMessage(msg: Message | boolean) {
//       setReplyMessage(msg)
//     }
//   }
// })()
setTimeout(() => {
    socket.on("adminLogin", () => {
        isAdmin = true;
        messages.forEach(message => {
            if (!message.isNotif) {
                message.messageStructure.querySelector(".deleteBtn").style.display = "inline-block";
            }
        });
    });
}, 100);
// let scrollCheck = (el:HTMLElement) => {
//   let viewportCheckEl = Array.from(parent.children)[Array.from(parent.children).indexOf(el) - 3] as HTMLElement
//   if (viewportCheckEl && isInViewport(viewportCheckEl)) {
//     el.scrollIntoView({ block: "center" })
//   }
// }
export let messageConstructor = (message, user, direction) => {
    let find = (q) => base.querySelector(q);
    let base = createNode({
        subNodes: [
            { className: "replyLabel" },
            {
                className: ["message"],
                subNodes: [
                    {
                        tag: "span",
                        className: "messageText"
                    },
                    {
                        tag: "form",
                        subNodes: [{
                                tag: "input"
                            }]
                    }, {
                        textContent: "edit",
                        className: "configBtn"
                    }, {
                        textContent: "delete",
                        className: "deleteBtn"
                    }, {
                        textContent: "reply",
                        className: "replyBtn"
                    }, {
                        textContent: "zoom",
                        className: "zoomBtn"
                    }, { tag: "br" }
                ]
            }
        ]
    });
    message.messageStructure = base;
    messagesDiv.appendChild((message.messageStructure));
    let editForm = find("form");
    let text = find(".messageText");
    let editBtn = find(".configBtn");
    let deleteBtn = find(".deleteBtn");
    let replyBtn = find(".replyBtn");
    let zoomBtn = find(".zoomBtn");
    let editInput = find("input");
    editForm.style.display = "none";
    text.textContent = `${message.content} ${message.isEdited ? "(edited)" : ""}`;
    //! self/other switch
    switch (direction) {
        case "self":
            base.children[1].prepend(nameLabel(message.user, true));
            base.style.backgroundColor = "#b4f3da";
            message.color = "#b4f3da";
            break;
        case "other":
            base.children[1].prepend(nameLabel(message.user));
            break;
    }
    //! reply button
    if (message.user.userId === "AAAAAAAAAAAA") {
        replyBtn.remove();
    }
    else {
        replyLogic(replyBtn, message);
    }
    //! check if user is owner of message
    if (message.isNotif || (user && message.user.userId !== user.userId) || !user) {
        editBtn.remove();
        if (!isAdmin || message.isNotif) {
            deleteBtn.style.display = "none";
        }
    }
    //! edit button
    else {
        editBtn.addEventListener("click", () => {
            editForm.style.display = "inline-block";
            text.style.display = "none";
            editBtn.style.display = "none";
            editInput.value = message.content;
            editInput.focus();
        });
        editForm.addEventListener("submit", e => {
            e.preventDefault();
            editForm.style.display = "none";
            text.style.display = "initial";
            editBtn.style.display = "block";
            socket.emit("edit", message.id, editInput.value);
        });
    }
    //! delete button
    deleteBtn.addEventListener("click", () => {
        deleteBtn.textContent = "Sure to delete ?";
        deleteBtn.addEventListener("click", () => {
            socket.emit("delete", message);
        });
    });
    //! notification addon
    if (message.isNotif && message.isNotif[0]) {
        switch (message.isNotif[1]) {
            case "hi":
                base.style.backgroundColor = "#06ea56";
                message.color = "#06ea56";
                break;
            case "fi":
                base.style.backgroundColor = "#ef523e";
                message.color = "#ef523e";
                break;
            case "promotion":
                base.style.backgroundColor = "#f5cc51";
                message.color = "#f5cc51";
                break;
            case "kick":
                base.style.backgroundColor = "black";
                base.style.color = "white";
        }
    }
    //! reply addon
    if (message.isReply) {
        let replyLabel = find(".replyLabel");
        replyLabel.textContent = `replying to ${message.isReply.user.username}: ${message.isImage ? "picture" : message.isReply.content}`;
        replyLabel.style.display = "block";
        replyLabel.addEventListener("click", () => {
            let div = messages.find(msg => msg.id === message.isReply.id).messageStructure;
            div.classList.add("replyNoticeAnimation");
            setTimeout(() => {
                div.classList.remove("replyNoticeAnimation");
            }, 3000);
            div.scrollIntoView({ block: "center" });
        });
    }
    else
        find(".replyLabel").remove();
    //! image addon
    if (message.isImage) {
        let image = `data:image/png;base64,${bufferToBase64(message.isImage)}`;
        let imageDiv = createNode({
            tag: "img",
            src: image
        });
        message.messageStructure.appendChild(imageDiv);
        message.messageStructure.style.backgroundColor = message.user.color;
        zoomBtn.addEventListener("click", () => {
            imageDiv.classList.toggle("imageZoom");
        });
    }
    else
        zoomBtn.remove();
};
let nameLabel = (user, isSelf = false) => {
    return createNode({
        tag: "span",
        className: "messageHeader",
        style: {
            backgroundColor: user.color,
            color: !colorIsLight(user.color) ? "#eee" : "black"
        },
        textContent: isSelf ? "you" : user.username
    });
};
// function formReplyToggle(replySwitch: boolean, message: Message) {
//   if(replySwitch) {
//     if(globalReplyMessage) {
//       (globalReplyMessage.messageStructure as HTMLElement).style.backgroundColor = globalReplyMessage.color
//     }
//     input.placeholder = `replying to ${message.user.username}...`;
//     (message.messageStructure as HTMLElement).style.backgroundColor = "#f8d362"
//   } else {
//     input.placeholder = ``;
//     (message.messageStructure as HTMLElement).style.backgroundColor = message.color
//   }
// }
export let replyFormSwitch = { message: false };
export let replyLogic = (replyBtn, message) => {
    let replyMode = false;
    replyBtn.addEventListener("click", () => {
        if (replyFormSwitch.message && replyFormSwitch.message.id === message.id) {
            replyFormSwitch.message.messageStructure.style.backgroundColor = replyFormSwitch.message.color;
            input.placeholder = ``;
            replyFormSwitch.message = false;
            replyMode = false;
            return 0;
        }
        if (!replyMode) {
            replyMode = true;
            replyFormSwitch.message = message;
            input.placeholder = `replying to ${message.user.username}...`;
            message.messageStructure.style.backgroundColor = "#f8d362";
            input.placeholder = `replying to ${message.user.username}...`;
            input.focus();
        }
        else {
            replyMode = false;
            replyFormSwitch.message = false;
            message.messageStructure.style.backgroundColor = message.color;
            input.placeholder = ``;
        }
    });
};
