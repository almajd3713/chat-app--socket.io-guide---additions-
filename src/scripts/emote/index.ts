
import {Emote} from "../classes.js"

export let emotes = (() => {
  let emoteArr: Emote[] = []
  let find = (q: string) => emoteArr.find(emo => emo.prefix === q)!
  let add = (q: Emote) => {emoteArr.push(q)}
  return {find, add}
})()

emotes.add(new Emote({
  prefix: ":augh:",
  type: "custom",
  content: "augh.webp"
}))