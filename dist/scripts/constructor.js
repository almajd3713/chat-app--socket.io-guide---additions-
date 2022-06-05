import { colorIsLight, createNode, isInViewport } from "./util.js";
let parent = document.querySelector(".messages");
import { socket } from "./index.js";
let scrollCheck = (el) => {
    let viewportCheckEl = Array.from(parent.children)[Array.from(parent.children).indexOf(el) - 3];
    if (viewportCheckEl && isInViewport(viewportCheckEl)) {
        el.scrollIntoView({ block: "center" });
    }
};
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
            }
        ]
    });
    let form = find("form");
    let text = find(".messageText");
    let editBtn = find(".configBtn");
    let input = find("input");
    form.style.display = "none";
    text.textContent = `${message.content} ${message.isEdited ? "(edited)" : ""}`;
    //! self/other switch
    switch (direction) {
        case "self":
            base.classList.add("util-messageSender");
            break;
        case "other":
            base.prepend(nameLabel(message.user));
            break;
    }
    //! edit button
    console.log(user);
    if (message.isNotif || (user && message.user.userId !== user.userId) || !user)
        editBtn.remove();
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
    //! notification
    if (message.isNotif && message.isNotif[0]) {
        switch (message.isNotif[1]) {
            case "hi":
                base.style.backgroundColor = "#06ea56";
                break;
            case "fi":
                base.style.backgroundColor = "#ef523e";
        }
    }
    message.messageStructure = base;
};
let nameLabel = (user) => {
    return createNode({
        tag: "span",
        className: "messageHeader",
        style: {
            backgroundColor: user.color,
            color: !colorIsLight(user.color) ? "#eee" : "black"
        },
        textContent: user.username
    });
};
// let replyModeWatcher = (/* base: HTMLElement,  */find: (q:string) => HTMLElement) => {
//   return new Proxy({val: false}, {
//     set: (target, key, value: boolean) => {
//       target["val"] = !target["val"]
//       if(target["val"]) {
//         find("input").style.display = ""
//         find("input").focus()
//       }
//       return true
//     }
//   })
// }
