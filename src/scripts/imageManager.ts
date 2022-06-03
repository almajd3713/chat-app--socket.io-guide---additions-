
export default async(e: ClipboardEvent, currentUser, notification, socket) => {
  if(!currentUser) {
    return notification("you can't post a picture without signing in !", "fi")
  }
  let a = e.clipboardData.files[0]
  if(a) {
    let img = await a.arrayBuffer()
    socket.emit("imageSend", img, currentUser)
  }
}