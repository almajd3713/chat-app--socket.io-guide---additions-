import { socket } from "./index.js";

let musicPlayer = new Audio()
let tracks: string[] = ["adventureLine", "saul"]

export default () => {
  let adminPlayMusic = (code: string, user: string, song: string) => {
    socket.emit("adminMusic", code, user, song)
  };
  // @ts-ignore
  window.adminPlayMusic = adminPlayMusic
  socket.on("adminMusic", (song: number) => {
    musicPlayer.src = `./audio/${tracks[song]}.opus`
    musicPlayer.play()
  })
}