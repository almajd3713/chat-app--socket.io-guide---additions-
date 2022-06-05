import { Message, User } from "./classes.js";
import { colorIsLight, createNode, isInViewport } from "./util.js";
let parent = document.querySelector(".messages")!
export type messageDir = "self" | "other" | "notif"

export type messageType = "message" | "notif"
type modules = "message" | "edit" | "reply" | "image" | "notif"


let scrollCheck = (el:HTMLElement) => {
  let viewportCheckEl = Array.from(parent.children)[Array.from(parent.children).indexOf(el) - 3] as HTMLElement
  if (viewportCheckEl && isInViewport(viewportCheckEl)) {
    el.scrollIntoView({ block: "center" })
  }
}

export let messageConstructor = (message: Message, direction?: messageDir) => {
  let
    editBtn: HTMLDivElement
  let find = (q:string) => base.querySelector(q)!
  let base = createNode({
    className: ["message"],
    attributes: [["dir", "auto"]]
  })
  console.log(base)
  switch (direction) {
    case "self":
      base.classList.add("util-messageSender")
      base.textContent = message.content
      break;
    case "other":
      base.textContent = message.content
      base.prepend(nameLabel(message.user))
      break
  }
  if(message.isNotif && message.isNotif[0]) {
    switch (message.isNotif[1]) {
      case "hi":
        base.style.backgroundColor = "#06ea56"
        break;
      case "fi":
        base.style.backgroundColor = "#ef523e"
    }
  }
  // let addModule = (module: modules) => {
  //   switch (module) {s
  //     case "edit":
  //       editBtn = createNode({
  //         textContent: "edit",
  //         className: "configBtn"
  //       }) as HTMLDivElesment
  //       base.appendChild(editBtn)
  //       break
  //   }
  // }
  return base
}
// export let oldMessageConstructor = (message: Message) => {
//   console.log(message)
//   let base = createNode({
//     className: ["message"],
//     attributes: [["dir", "auto"]]
//   })
//   base.textContent = message.content
//   if(message.isNotif) {
//     console.log("Aye")
//     base.prepend(nameLabel(message.user))
//     if (message.user.userId === "AAAAAAAAAAAA") {
//       base.style.backgroundColor = "yellow"
//     }
//   }
//   return base
// }

let nameLabel = (user: User) => {
  return createNode({
    tag: "span",
    className: "messageHeader",
    style: {
      backgroundColor: user.color,
      color: !colorIsLight(user.color) ? "#eee" : "black"
    },
    textContent: user.username
  })
}