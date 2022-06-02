
export default async(e, currentUser, notification, socket) => {
  if(!currentUser) {
    return notification("you can't post a picture without signing in !", "fi")
  }
  let a = e.clipboardData.files[0]
  if(a) {
    let img = await a.arrayBuffer()
    socket.emit("imageSend", img, currentUser)
  }
}


// let requestImage = async(image, currentUser) => {
//   let img = await image.arrayBuffer()
//   // console.log(img)
//   // let url = await fetch(`/`, {
//   //   method: "POST",
//   //   body: img,
//   //   headers: {
//   //     "Content-Type": "image/png"
//   //   }
//   // })
//   socket.emit("imageSend", img, currentUser)
// }