import { Emote } from "../classes.js";
import { input } from "../index.js";
import { createNode } from "../util.js";
export let emotes = (() => {
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
                input.setRangeText(`${emote.prefix} `);
                let end = input.value.length;
                input.setSelectionRange(end, end);
                input.focus();
            });
        });
        emoteTrigger.addEventListener("click", () => {
            emoteBox.classList.toggle("emoteBoxVisible");
        });
    };
    return { find, add, init };
})();
emotes.add(new Emote({
    prefix: ":laugh:",
    type: "emoji",
    content: "😂"
}));
emotes.add(new Emote({
    prefix: ":augh:",
    type: "custom",
    content: "augh.webp"
}));
emotes.add(new Emote({
    prefix: ":siuu:",
    type: "custom",
    content: "siuu.webp"
}));
