import { colorIsLight, createNode } from "./util.js";
let parent = document.querySelector(".messages");
import { messages, socket } from "./index.js";
// type modules = "message" | "edit" | "reply" | "image" | "notif"
let isAdmin = false;
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
            }
        ]
    });
    let form = find("form");
    let text = find(".messageText");
    let editBtn = find(".configBtn");
    let deleteBtn = find(".deleteBtn");
    let replyBtn = find(".replyBtn");
    let input = find("input");
    form.style.display = "none";
    text.textContent = `${message.content} ${message.isEdited ? "(edited)" : ""}`;
    //! self/other switch
    switch (direction) {
        case "self":
            base.prepend(nameLabel(message.user, true));
            base.style.backgroundColor = "#b4f3da";
            break;
        case "other":
            base.prepend(nameLabel(message.user));
            break;
    }
    //! reply button
    if (message.user.userId === "AAAAAAAAAAAA") {
        replyBtn.remove();
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
            form.style.display = "block";
            text.style.display = "none";
            editBtn.style.display = "none";
            input.value = message.content;
            input.focus();
        });
        form.addEventListener("submit", e => {
            e.preventDefault();
            form.style.display = "none";
            text.style.display = "initial";
            editBtn.style.display = "block";
            socket.emit("edit", message.id, input.value);
        });
    }
    //! delete button
    deleteBtn.addEventListener("click", () => {
        deleteBtn.textContent = "Sure to delete ?";
        deleteBtn.addEventListener("click", () => {
            socket.emit("delete", message);
        });
    });
    //! notification
    if (message.isNotif && message.isNotif[0]) {
        switch (message.isNotif[1]) {
            case "hi":
                base.style.backgroundColor = "#06ea56";
                break;
            case "fi":
                base.style.backgroundColor = "#ef523e";
                break;
            case "promotion":
                base.style.backgroundColor = "#f5cc51";
        }
    }
    message.messageStructure = base;
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
