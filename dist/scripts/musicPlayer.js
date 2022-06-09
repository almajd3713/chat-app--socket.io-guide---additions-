import { socket } from "./index.js";
let musicPlayer = new Audio();
let tracks = ["adventureLine", "saul"];
export default () => {
    let adminPlayMusic = (code, user, song) => {
        socket.emit("adminMusic", code, user, song);
    };
    // @ts-ignore
    window.adminPlayMusic = adminPlayMusic;
    socket.on("adminMusic", (song) => {
        musicPlayer.src = `./audio/${tracks[song]}.opus`;
        musicPlayer.play();
    });
};
