import { Emote } from "../classes.js";
import { input } from "../index.js";
import { createNode } from "../util.js";
export let emotes = (() => {
    let isInited = false;
    let emoteArr = [];
    let find = (q) => emoteArr.find(emo => emo.prefix === q);
    let add = (q) => { emoteArr.push(q); };
    let init = () => {
        let emoteBox = document.querySelector(".emoteBox");
        let emoteTrigger = document.querySelector(".emoteTrigger");
        emoteArr.forEach(emote => {
            let emoteDiv = createNode({
                tag: emote.type === "emoji" ? "span" : "img",
                className: "emoteBoxEl",
            });
            if (emote.type === "custom")
                emoteDiv.setAttribute("src", `scripts/emote/${emote.content}`);
            else
                emoteDiv.textContent = emote.content;
            emoteBox.appendChild(emoteDiv);
            emoteDiv.addEventListener("click", () => {
                if (input.value.length <= 100) {
                    input.setRangeText(`${emote.prefix} `);
                    let end = input.value.length;
                    input.setSelectionRange(end, end);
                    input.focus();
                }
            });
        });
        emoteTrigger.addEventListener("click", () => {
            emoteBox.classList.toggle("emoteBoxVisible");
        });
        isInited = true;
    };
    return { find, add, init, isInited };
})();
let emoteArr = [
    ["laugh", "😂"],
    ["laughBig", "🤣"],
    ["facepalm", "🤦‍♂️"],
    ["inlove", "😍"],
    ["heart", "💚"],
    ["cry", "😭"],
    ["angry", "😡"],
    ["thumbUp", "👍"],
    ["thumbDown", "👎"],
    ["pointLeft", "👈"],
    ["pointRight", "👉"],
];
let customEmoteArr = ["pwease", "siuu", "holy", "notGood", "sedj", "sussy", "woman", "saul", "sweat"];
emoteArr.forEach(arr => {
    emotes.add(new Emote({
        prefix: `:${arr[0]}Emote:`,
        type: "emoji",
        content: arr[1]
    }));
});
customEmoteArr.forEach(emote => {
    emotes.add(new Emote({
        prefix: `:${emote}:`,
        type: "custom",
        content: `${emote}.webp`
    }));
});
