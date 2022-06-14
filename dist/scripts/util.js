let CryptoJS = window.CryptoJS;
export function createNode(props) {
    let node = document.createElement(props.tag || "div");
    if (props.className) {
        if (Array.isArray(props.className))
            props.className.forEach(classN => node.classList.add(classN));
        else
            node.className = props.className;
    }
    if (props.id) {
        node.setAttribute("id", props.id);
    }
    if (props.src) {
        node.setAttribute("src", props.src);
    }
    if (props.attributes) {
        props.attributes.forEach(attr => {
            node.setAttribute(attr[0], attr[1]);
        });
    }
    if (props.textContent) {
        node.innerHTML = props.textContent;
    }
    if (props.subNodes) {
        if (props.subNodes instanceof HTMLElement)
            node.appendChild(props.subNodes);
        else if (Array.isArray(props.subNodes))
            props.subNodes.forEach(subNode => {
                if (subNode instanceof HTMLElement)
                    node.appendChild(subNode);
                else
                    node.appendChild(createNode(subNode));
            });
        else
            node.appendChild(createNode(props.subNodes));
    }
    if (props.style)
        for (let prop in props.style) {
            // @ts-ignore
            node.style[prop] = props.style[prop];
        }
    if (props.onClick)
        node.onclick = props.onClick;
    return node;
}
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth));
}
export function colorIsLight(color) {
    if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color))
        return true;
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155;
}
export let welcomeMessageBuild = (list) => {
    let str = `Welcome ! there ${list.length >= 2 ? "are" : "is"} ${list.length} people online. `;
    if (list.length) {
        list.forEach((person, i, arr) => {
            let tempStr = `"${person.username}"`;
            if (arr[i + 1]) {
                tempStr = `${tempStr}, `;
                if (!arr[i + 2])
                    tempStr = `${tempStr} and `;
            }
            else {
                tempStr = `${tempStr}.`;
            }
            str = str + tempStr;
        });
    }
    return str;
};
export let bufferToBase64 = (buffer) => {
    // @ts-ignore
    // too lazu to figure how this works, good as long as it works
    let base = btoa([].reduce.call(new Uint8Array(buffer), function (p, c) { return p + String.fromCharCode(c); }, ''));
    return base;
};
// @ts-ignore
export let encryptor = (item, method) => {
    let result;
    switch (method) {
        case "encrypt":
            result = CryptoJS.AES.encrypt(JSON.stringify(item), "H0LYG4LUNG4").toString();
            break;
        case "decrypt":
            let _ = CryptoJS.AES.decrypt(item, "H0LYG4LUNG4");
            let _2 = CryptoJS.enc.Utf8.stringify(_);
            result = JSON.parse(_2);
            console.log(result);
    }
    return result;
};
