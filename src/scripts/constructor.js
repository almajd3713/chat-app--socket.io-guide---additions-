import { createNode, isInViewport } from "./util";
let parent = document.querySelector(".messages");
let scrollCheck = (el) => {
    let viewportCheckEl = Array.from(parent.children)[Array.from(parent.children).indexOf(el) - 3];
    if (viewportCheckEl && isInViewport(viewportCheckEl)) {
        el.scrollIntoView({ block: "center" });
    }
};
export let messageConstructor = (message, type) => {
    let editBtn;
    let find = (q) => base.querySelector(q);
    let base = createNode({
        className: ["message"],
        attributes: [["dir", "auto"]]
    });
    switch (type) {
        case "self":
            base.classList.add("util-messageSender");
            base.textContent = message.content;
            break;
        default:
            break;
    }
    let addModule = (module) => {
        switch (module) {
            case "edit":
                editBtn = createNode({
                    textContent: "edit",
                    className: "configBtn"
                });
                base.appendChild(editBtn);
                break;
            case "self":
        }
    };
    return { base, addModule };
};
