import { User } from "./classes.js"

interface Props {
  tag?: string
  className?: string | string[]
  id?: string
  src?: string
  attributes?: [string, string][]
  textContent?: string
  subNodes?: Props | Props[]
  onClick?: () => void
  style?: Partial<CSSStyleDeclaration>
}
export function createNode(props: Props): HTMLElement {
  let node = document.createElement(props.tag || "div")
  if (props.className) {
    if (Array.isArray(props.className)) props.className.forEach(classN => node.classList.add(classN))
    else node.className = props.className
  }
  if (props.id) { node.setAttribute("id", props.id) }
  if (props.src) { node.setAttribute("src", props.src) }
  if (props.attributes) {
    props.attributes.forEach(attr => {
      node.setAttribute(attr[0], attr[1])
    })
  }
  if (props.textContent) { node.innerHTML = props.textContent }
  if (props.subNodes) {
    if (props.subNodes instanceof HTMLElement) node.appendChild(props.subNodes)
    else if (Array.isArray(props.subNodes)) props.subNodes.forEach(subNode => {
      if (subNode instanceof HTMLElement) node.appendChild(subNode)
      else node.appendChild(createNode(subNode))
    }); else node.appendChild(createNode(props.subNodes))
  }
  if(props.style) for(let prop in props.style) {
    // @ts-ignore
    node.style[prop] = props.style[prop]
  }
  if (props.onClick) node.onclick = props.onClick
  return node
}

export let replyFormSwitch = false
// export let replyLogic = (replyBtn, message) => {
//   let replyMode = false
//   replyBtn.addEventListener("click", e => {
//     if (!replyMode) {
//       replyMode = true
//       replyFormSwitch = message
//       typingMessage = `replying to ${message.user.username}...`
//       message.messageStructure.style.backgroundColor = "#f8d362"
//       input.placeholder = `replying to ${message.user.username}...`
//       input.focus()
//     } else {
//       replyMode = false
//       replyFormSwitch = false
//       message.messageStructure.style.backgroundColor = "initial"
//       input.placeholder = ``
//     }
//   })
// };
export function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
export function colorIsLight(color: string) {
  if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color)) return true
  const hex = color.replace('#', '');
  const c_r = parseInt(hex.substr(0, 2), 16);
  const c_g = parseInt(hex.substr(2, 2), 16);
  const c_b = parseInt(hex.substr(4, 2), 16);
  const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
  return brightness > 155;
}

export let welcomeMessageBuild = (list: User[]) => {
  let str = `Welcome ! there ${list.length >= 2 ? "are" : "is"} ${list.length} people online. `;
  if (list.length) {
    list.forEach((person, i, arr) => {
      let tempStr = `"${person.username}"`;
      if (arr[i + 1]) {
        tempStr = `${tempStr}, `;
        if (!arr[i + 2])
          tempStr = `${tempStr} and `;
      } else {
        tempStr = `${tempStr}.`;
      }
      str = str + tempStr;
    });
  }
  return str;
};