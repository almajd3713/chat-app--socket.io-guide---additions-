import { popupContainer } from "./index.js";
import { bufferToBase64 } from "./util.js";
let imageContainer = document.querySelector("#imageviewer");
export default (() => {
    let list = [];
    let pointer = 0;
    let add = (img) => list.push(img);
    let remove = (img) => list = list.filter(msg => msg.id !== img.id);
    let display = (img) => {
        var _a;
        imageContainer.innerHTML = `<img src="data:image/png;base64,${bufferToBase64((_a = list.find(image => image.id === img.id)) === null || _a === void 0 ? void 0 : _a.isImage)}"/>`;
        popupContainer.classList.add("visible");
        imageContainer.classList.add("visible");
        pointer = list.indexOf(img);
    };
    let move = (dir) => {
        if (imageContainer.classList.contains("visible")) {
            if (dir === "up" && list[pointer - 1])
                pointer -= 1;
            else if (dir === "down" && list[pointer + 1])
                pointer += 1;
            imageContainer.innerHTML = `<img src="data:image/png;base64,${bufferToBase64(list[pointer].isImage)}"/>`;
            // if (dir === "up" && list[pointer]) {
            //   imageContainer.innerHTML = `<img src="data:image/png;base64,${bufferToBase64(list[pointer].isImage as string)}"/>`
            //   pointer -= 1
            // } else if (dir === "down" && list[pointer + 1]) {
            //   pointer += 1
            //   imageContainer.innerHTML = `<img src="data:image/png;base64,${bufferToBase64(list[pointer].isImage as string)}"/>`
            // } else return;
        }
    };
    return { add, remove, display, move };
})();
