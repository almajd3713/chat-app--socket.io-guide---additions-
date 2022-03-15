
document.addEventListener("paste", (e) => {
  if(!currentUser) {
    return pushNotification("you can't post a picture without signing in !", "fi")
  }
  let a = e.clipboardData.files[0]
  if(a) {
    requestImage(a)
  }
})

let requestImage = async(image) => {
  let img = await image.arrayBuffer()
  // console.log(img)
  // let url = await fetch(`/`, {
  //   method: "POST",
  //   body: img,
  //   headers: {
  //     "Content-Type": "image/png"
  //   }
  // })
  socket.emit("imageSend", img, currentUser)
}