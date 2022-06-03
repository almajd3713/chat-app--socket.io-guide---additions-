import { createNode } from "./util";
export let messageConstructor = (() => {
    let editBtn;
    let base = createNode({
        className: ["message", "util-messageSender"],
        attributes: [["dir", "auto"]]
    });
    let addModule = (module) => {
        switch (module) {
            case "edit":
                editBtn = createNode({
                    textContent: "edit",
                    className: "configBtn"
                });
                base.appendChild(editBtn);
                break;
        }
    };
    return { base, addModule };
})();
