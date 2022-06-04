import { Message } from "./classes";
import { createNode, isInViewport } from "./util";
let parent = document.querySelector(".messages")!
type messageType = "self" | "other" | "notif"

let scrollCheck = (el:HTMLElement) => {
  let viewportCheckEl = Array.from(parent.children)[Array.from(parent.children).indexOf(el) - 3] as HTMLElement
  if (viewportCheckEl && isInViewport(viewportCheckEl)) {
    el.scrollIntoView({ block: "center" })
  }
}

export let messageConstructor = (message: Message, type: messageType) => {
  let
    editBtn: HTMLDivElement
  let find = (q:string) => base.querySelector(q)!
  type modules = "edit" | "reply" | "image" | "self"
  let base = createNode({
    className: ["message"],
    attributes: [["dir", "auto"]]
  })
  switch (type) {
    case "self":
      base.classList.add("util-messageSender")
      base.textContent = message.content
      break;
  
    default:
      break;
  }
  let addModule = (module: modules) => {
    switch (module) {
      case "edit":
        editBtn = createNode({
          textContent: "edit",
          className: "configBtn"
        }) as HTMLDivElement
        base.appendChild(editBtn)
        break
      case "self":
    }
  }
  return {base, addModule}
}
