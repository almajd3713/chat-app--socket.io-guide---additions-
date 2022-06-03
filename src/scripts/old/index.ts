import {createNode, replyFormSwitch, replyLogic, isInViewport, colorIsLight} from "./util.js"
import pasteListener from "./imageManager.js" 

let socket = io();

let form = document.getElementById('form');
let input = document.getElementById('input');
let messagesDiv = document.querySelector('.messages');
let typingMessage = document.querySelector(".typing")
let currentUser
let printedMessages = []

let firstMessage = true
form.addEventListener("submit", (e) => {
  e.preventDefault()
  if (input.value) {
    if (firstMessage) {
      socket.emit("messageFirst", input.value)
      input.value = ""
      input.placeholder = ""
      firstMessage = false
    } else if (replyFormSwitch) {
      socket.emit("message", input.value, currentUser, replyFormSwitch)
      input.value = ""
      if (replyFormSwitch.isImage) {
        replyFormSwitch.messageStructure.style.backgroundColor = replyFormSwitch.user.color || "#000000"
      } else {
        replyFormSwitch.messageStructure.style.backgroundColor = "initial"
      }
      replyFormSwitch = false
      replyMode = false
      input.placeholder = ``
    }
    else {
      socket.emit("message", input.value, currentUser)
      input.value = ""
    }
  }
});

socket.on("messageAdmin", (message) => {
  if (!message.isImage) {
    let editBtn = createNode({
      tag: "div",
      textContent: "edit",
      className: "configBtn"
    })
    message.messageStructure = createNode({
      tag: "div",
      className: ["message", "util-messageSender"],
      attributes: [["dir", "auto"]],
      textContent: `${message.content}`,
      subNodes: editBtn
    })
    messagesDiv.appendChild(message.messageStructure)
    let viewportCheckEl = Array.from(messagesDiv.children)[Array.from(messagesDiv.children).indexOf(message.messageStructure) - 2]
    if (viewportCheckEl && isInViewport(viewportCheckEl)) {
      message.messageStructure.scrollIntoView({ block: "center" })
    }
    if (message.replyTo) {
      let replyMessage = message.replyTo
      let replyDiv = createNode({
        tag: "div",
        className: "replyLabel",
        textContent: `replying to ${message.replyTo.user.username}: ${replyMessage.isImage ? "picture" : replyMessage.content}`
      })
      replyDiv.addEventListener("click", e => {
        let desiredMessage = printedMessages.find(mes => mes.id === message.replyTo.id)
        desiredMessage.messageStructure.classList.add("replyNoticeAnimation")
        setTimeout(() => {
          desiredMessage.messageStructure.classList.remove("replyNoticeAnimation")
        }, 3100);
        desiredMessage.messageStructure.scrollIntoView({ block: "center" })
      })
      messagesDiv.insertBefore(replyDiv, message.messageStructure)
    }
    editBtn.addEventListener("click", e => {
      message.messageStructure.textContent = ""
      message.messageStructure.prepend(createNode({
        tag: "form",
        subNodes: {
          tag: "input",
          attributes: [["value", message.content]]
        }
      }))
      message.messageStructure.children[0].children[0].focus()
      message.messageStructure.children[0].addEventListener("submit", e => {
        e.preventDefault()
        let val = e.srcElement.children[0].value
        message.messageStructure.textContent = `${val} (edited)`
        message.messageStructure.appendChild(editBtn)
        socket.emit("editSend", val, message)
        e.srcElement.children[0].remove()
      })
    })
  } else {
    let imgUrl = `data:image/png;base64,${bufferToBase64(message.image)}`
    message.messageStructure = createNode({
      tag: "div",
      className: ["imageMessage", "util-messageSender"],
      subNodes: [{
        tag: "div",
        className: "imageMessageHeader",
        textContent: `<span style="color: ${!colorIsLight(message.user.color || "#000000") ? "#eee" : "initial"}; margin-right: 0;">you sent a picture:</span>`
      }, {
        tag: "img",
        src: imgUrl
      }]
    })
    message.messageStructure.style.backgroundColor = message.user.color || "#000000"
    message.messageStructure.children[1].onclick = () => {
      let imageTab = window.open()
      imageTab.document.body.style.backgroundColor = "black"
      imageTab.document.body.innerHTML = `<img src="${imgUrl}" style="width: 80vwrem"/>`
    }
    messagesDiv.appendChild(message.messageStructure)
    let viewportCheckEl = Array.from(messagesDiv.children)[Array.from(messagesDiv.children).indexOf(message.messageStructure) - 2]
    if (viewportCheckEl && isInViewport(viewportCheckEl)) {
      message.messageStructure.scrollIntoView()
    }
  }
  printedMessages.push(message)
});

socket.on("editReceive", (val, message) => {
  let desiredMessage = printedMessages.find(mes => mes.id === message.id)
  if (desiredMessage) {
    desiredMessage.content = val
    desiredMessage.messageStructure.textContent = `${desiredMessage.user.username}: ${val} (edited)`
  }
})
socket.on("message", (message) => {
  if (!message.isImage) {
    let replyBtn = createNode({
      tag: "div",
      textContent: "reply",
      className: "configBtn"
    })
    message.messageStructure = createNode({
      tag: "div",
      className: "message",
      textContent: `<span class="messageHeader" style="background-color: ${message.user.color || "#000000"}; color: ${!colorIsLight(message.user.color || "#000000") ? "#eee" : "initial"}">${message.user.username}</span> <span dir="auto">${message.content}</span>`,
    })
    if (currentUser) {
      message.messageStructure.appendChild(replyBtn)
      replyLogic(replyBtn, message)
    }
    messagesDiv.appendChild(message.messageStructure)
    let viewportCheckEl = Array.from(messagesDiv.children)[Array.from(messagesDiv.children).indexOf(message.messageStructure) - 2]
    if (viewportCheckEl && isInViewport(viewportCheckEl)) {
      message.messageStructure.scrollIntoView()
    }
    if (message.replyTo) {
      let replyMessage = message.replyTo
      let replyDiv = createNode({
        tag: "div",
        className: "replyLabel",
        textContent: `replying to ${replyMessage.user.username}: ${replyMessage.isImage ? "picture" : replyMessage.content}`
      })
      replyDiv.addEventListener("click", e => {
        let desiredMessage = printedMessages.find(mes => mes.id === message.replyTo.id)
        desiredMessage.messageStructure.classList.add("replyNoticeAnimation")
        desiredMessage.messageStructure.scrollIntoView()
        setTimeout(() => {
          desiredMessage.messageStructure.classList.remove("replyNoticeAnimation")
        }, 3100);
      })
      messagesDiv.insertBefore(replyDiv, message.messageStructure)
    }
  }
  else {
    let imgUrl = `data:image/png;base64,${bufferToBase64(message.image)}`
    message.messageStructure = createNode({
      tag: "div",
      className: "imageMessage",
      subNodes: [{
        tag: "div",
        className: "imageMessageHeader",
        textContent: `<span style="color: ${!colorIsLight(message.user.color) ? "#eee" : "initial"}; margin-right: 0;">${message.user.username} sent a picture:</span>`
      }, {
        tag: "img",
        src: imgUrl
      }, {
        tag: "div",
        className: ["imageZoomBtn"],
        textContent: "click to zoom/unzoom image"
      }]
    })
    message.messageStructure.style.backgroundColor = message.user.color || "#000000"
    message.messageStructure.querySelector(".imageZoomBtn").addEventListener("click", () => message.messageStructure.querySelector("img").classList.toggle("imageZoom"))
    // message.messageStructure.children[1].onclick = () => {
    //   let imageTab = window.open()
    //   imageTab.document.body.style.backgroundColor = "black"
    //   imageTab.document.body.innerHTML = `<img src="${imgUrl}" style="width: 80vwrem"/>`
    // }
    messagesDiv.appendChild(message.messageStructure)
    let viewportCheckEl = Array.from(messagesDiv.children)[Array.from(messagesDiv.children).indexOf(message.messageStructure) - 2]
    if (viewportCheckEl && isInViewport(viewportCheckEl)) {
      message.messageStructure.scrollIntoView()
    }
    let replyBtn = createNode({
      tag: "div",
      textContent: "reply",
      className: "configBtn"
    })
    if (currentUser) {
      message.messageStructure.appendChild(replyBtn)
      replyLogic(replyBtn, message)
    }
    // if (message.replyTo) {
    //   let replyDiv = createNode({
    //     tag: "div",
    //     className: "replyLabel",
    //     textContent: `replying to ${message.replyTo.user.username}: picture`
    //   })
    //   replyDiv.addEventListener("click", e => {
    //     let desiredMessage = printedMessages.find(mes => mes.id === message.replyTo.id)
    //     desiredMessage.messageStructure.classList.add("replyNoticeAnimation")
    //     setTimeout(() => {
    //       desiredMessage.messageStructure.classList.remove("replyNoticeAnimation")
    //     }, 3100);
    //     desiredMessage.messageStructure.scrollIntoView()
    //   })
    //   console.log(replyDiv)
    //   console.log(message.messageStructure)
    //   messagesDiv.appendChild(replyBtn)
    // }
  }
  printedMessages.push(message)
})

socket.on("initUser", (user) => {
  console.log(user)
  currentUser = user
})

let typeTimeout = null
input.addEventListener("input", () => {
  socket.emit("typing")
})

socket.on("typing", (username) => {
  if (username) {
    clearTimeout(typeTimeout)
    typingMessage.textContent = `${username} is typing...`
    typeTimeout = setTimeout(() => {
      typingMessage.textContent = ""
    }, 1000);
  }
})

const pushNotification = (data, type) => {
  let el = document.createElement("div")
  el.className = "message"
  el.textContent = data
  type === "hi" ? el.style.backgroundColor = "#31d2d8" :
    type === "fi" ? el.style.backgroundColor = "#e57171" : null;
  messagesDiv.appendChild(el)
}

socket.on("hi", (data, welcomeMessage) => {
  pushNotification(data, "hi")
});
socket.on("fi", (data) => {
  pushNotification(`${data.username} has left us, how sedj /:`, "fi")
});
// socket.on("discon", () => socket.emit("disconnect"))
let adminPurge = (password) => { socket.emit("purgeAdmin", password) }
socket.on("purgeStatus", (status) => {
  if (status) location.reload()
  else console.log("oi you're an impostor !")
})
let bufferToBase64 = (buffer) => {
  let base = btoa([].reduce.call(new Uint8Array(buffer), function (p, c) { return p + String.fromCharCode(c) }, ''))
  return base
};

let kickPerson = (password, user) => {
  socket.emit("kickPerson", password, user)
};

document.addEventListener("paste", e => pasteListener(e, currentUser, pushNotification, socket))