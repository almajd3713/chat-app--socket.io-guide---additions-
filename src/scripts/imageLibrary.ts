import { Message } from "./classes"
import { popupContainer } from "./index.js"
import { bufferToBase64 } from "./util.js"

let imageContainer = document.querySelector("#imageviewer") as HTMLElement

export default (() => {
  let list: Message[] = []
  let pointer: number = 0
  let add = (img: Message) => list.push(img)
  let remove = (img: Message) => list = list.filter(msg => msg.id !== img.id)
  let display = (img: Message) => {
    imageContainer.innerHTML = `<img src="data:image/png;base64,${bufferToBase64(list.find(image => image.id === img.id)?.isImage as string)}"/>`
    popupContainer.classList.add("visible")
    imageContainer.classList.add("visible")
    pointer = list.indexOf(img)
  }
  let move = (dir: "up"|"down") => {
    if(imageContainer.classList.contains("visible")) {
      if(dir === "up" && list[pointer - 1]) pointer -= 1
      else if(dir === "down" && list[pointer + 1]) pointer += 1
      imageContainer.innerHTML = `<img src="data:image/png;base64,${bufferToBase64(list[pointer].isImage as string)}"/>`
      // if (dir === "up" && list[pointer]) {
      //   imageContainer.innerHTML = `<img src="data:image/png;base64,${bufferToBase64(list[pointer].isImage as string)}"/>`
      //   pointer -= 1
      // } else if (dir === "down" && list[pointer + 1]) {
      //   pointer += 1
      //   imageContainer.innerHTML = `<img src="data:image/png;base64,${bufferToBase64(list[pointer].isImage as string)}"/>`
      // } else return;
    }
  }
  return {add, remove, display, move}
})()