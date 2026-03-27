/* eslint-disable @typescript-eslint/no-explicit-any */
import {getEventName} from "../util/compatibility";
import { StyleManager } from "../util/styleManager";
import {MenuItem} from "./MenuItem";
import {hidePanel, toggleSubMenu} from "./setToolbar";

export class FontSize extends MenuItem {
    public element: HTMLElement;

    // 样式管理器
    public styleManager = new StyleManager();

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        const actionBtn = this.element.children[0] as HTMLElement;
        const panelElement = document.createElement("div");
        panelElement.className = `vditor-hint${menuItem.level === 2 ? "" : " vditor-panel--arrow"}`;
        panelElement.innerHTML = `<button data-value="12">12px</button>
<button data-value="13">13px</button>
<button data-value="14">14px</button>
<button data-value="15">15px</button>
<button data-value="16">16px</button>
<button data-value="18">18px</button>
<button data-value="20">20px</button>
<button data-value="24">24px</button>
<button data-value="28">28px</button>
<button data-value="32">32px</button>
<button data-value="40">40px</button>
<button data-value="48">48px</button>`;
        panelElement.addEventListener(getEventName(), (event: MouseEvent & { target: HTMLElement }) => {
            const btnElement = event.target;
            if (btnElement.tagName === "BUTTON") {
                const size = btnElement.getAttribute("data-value");
                actionBtn.textContent = size;
                if (size === '14') {
                    this.styleManager.clearStyle(
                        vditor,
                        "font-size",
                    );
                } else {
                    this.styleManager.setStyle(
                        vditor,
                        "font-size",
                        `${size}px`
                    );
                }
                hidePanel(vditor, ["subToolbar"]);
                event.preventDefault();
                event.stopPropagation();
            }
        });
        this.element.appendChild(panelElement);
        toggleSubMenu(vditor, panelElement, actionBtn, menuItem.level);
    }
}
