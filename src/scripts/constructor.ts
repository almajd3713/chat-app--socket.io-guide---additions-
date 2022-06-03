import { createNode } from "./util";

export let messageConstructor = (() => {
  let
    editBtn: HTMLDivElement
  type modules = "edit" | "reply" | "image"
  let base = createNode({
    className: ["message", "util-messageSender"],
    attributes: [["dir", "auto"]]
  })
  let addModule = (module: modules) => {
    switch (module) {
      case "edit":
        editBtn = createNode({
          textContent: "edit",
          className: "configBtn"
        }) as HTMLDivElement
        base.appendChild(editBtn)
        break
    }
  }
  return {base, addModule}
})()