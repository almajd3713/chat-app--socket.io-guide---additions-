import { Emote } from "../classes.js";
export let emotes = (() => {
    let emoteArr = [];
    let find = (q) => emoteArr.find(emo => emo.prefix === q);
    let add = (q) => { emoteArr.push(q); };
    return { find, add };
})();
emotes.add(new Emote({
    prefix: ":augh:",
    type: "custom",
    content: "augh.webp"
}));
