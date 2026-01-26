/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constants } from "../constants";
import {getEventName} from "../util/compatibility";
import { getEditorRange } from "../util/selection";
import {MenuItem} from "./MenuItem";
import {hidePanel, toggleSubMenu} from "./setToolbar";

export class FontSize extends MenuItem {
    public element: HTMLElement;

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
                const range = getEditorRange(vditor);
                const nodes = this.getRangeNodes(range);
                const text = range.toString();
                if (nodes.length > 1) {
                    nodes.forEach((node, index) => {
                        const style = node.getAttribute('style');
                        const styles = style ? style.split(';') : [];
                        const styleIndex = styles.findIndex(item => item.includes('font-size'));
                        if (styleIndex > -1) {
                            styles.splice(styleIndex, 1);
                        }
                        const textContent = node.textContent;
                        // 在第一个节点后添加
                        if (index === 0) {
                            let html = `${textContent.slice(range.startOffset)}`;
                            if (styles.length) {
                                html = `<span style="font-size: ${size}px;${styles.join(';')}">${html}</span>`;
                            }
                            node.insertAdjacentHTML('afterend', html);
                            node.textContent = node.textContent.slice(0, range.startOffset);
                        } else if (index === nodes.length - 1) {
                            let html = textContent.slice(0, range.endOffset);
                            if (styles.length) {
                                html = `<span style="font-size: ${size}px;${styles.join(';')}">${html}</span>`;
                            }
                            node.insertAdjacentHTML('beforebegin', html);
                            node.textContent = node.textContent.slice(range.endOffset);
                        } else {
                            let html = node.textContent;
                            if (styles.length) {
                                html = `<span style="font-size: ${size}px;${styles.join(';')}">${html}</span>`;
                            }
                            node.insertAdjacentHTML('beforebegin', html);
                            node.textContent = '';
                        }
                        // 节点不存在则删除
                        if (!node.textContent) {
                            node.remove();
                        }
                    })
                } else {
                    const node = nodes[0];
                    const style = node.getAttribute('style');
                    const styles = style ? style.split(';') : [];
                    const styleIndex = styles.findIndex(item => item.includes('font-size'));
                    if (styleIndex > -1) {
                        styles.splice(styleIndex, 1);
                    }
                    const curSize = node.style.fontSize;
                    const textContent = node.textContent;
                    if (!curSize) {
                        if (textContent) {
                            node.innerHTML = node.innerHTML.replace(textContent, `<span style="font-size: ${size}px;${styles.join(';')}">${textContent || Constants.ZWSP}</span>`);
                        } else {
                            node.innerHTML = `<span style="font-size: ${size}px;${styles.join(';')}">${Constants.ZWSP}</span>`;
                        }
                    } else {
                        // 修改字号
                        if (!text) {
                            node.innerHTML = `<span style="font-size: ${size}px;${styles.join(';')}">${textContent}</span>`;
                        } else if (textContent === text) {
                            node.insertAdjacentHTML('beforebegin', `<span style="font-size: ${size}px;${styles.join(';')}">${text}</span>`);
                            node.remove();
                        } else if (textContent.includes(text)) {
                            // 节点包含选中文本时，添加文本
                            if (textContent.startsWith(text)) {
                                node.insertAdjacentHTML('beforebegin', `<span style="font-size: ${size}px;${styles.join(';')}">${text}</span>`);
                                node.innerHTML = node.innerHTML.replace(text, '');
                            } else if (textContent.endsWith(text)) {
                                node.insertAdjacentHTML('afterend', `<span style="font-size: ${size}px;${styles.join(';')}">${text}</span>`);
                                node.innerHTML = node.innerHTML.replace(text, '');
                            } else {
                                const [ textBefore, textAfter ] = textContent.split(text);
                                node.insertAdjacentHTML('beforebegin', `<span style="font-size: ${curSize};${styles.join(';')}">${textBefore}</span>`);
                                node.insertAdjacentHTML('afterend', `<span style="font-size: ${curSize};${styles.join(';')}">${textAfter}</span>`);
                                node.innerHTML = `<span style="font-size: ${size}px;${styles.join(';')}">${text}</span>`;
                            }
                        }
                    }
                }
                hidePanel(vditor, ["subToolbar"]);
                event.preventDefault();
                event.stopPropagation();
            }
        });
        this.element.appendChild(panelElement);
        toggleSubMenu(vditor, panelElement, actionBtn, menuItem.level);
    }

    getRangeNodes(range: Range): HTMLElement[] {
        const contents = range.cloneContents();
        let element: any = range.startContainer;
        if (element.nodeType === 3) {
            element = element.parentElement;
        }
        if (contents.children.length > 1) {
            const result = [];
            for (let i = 0; i < contents.children.length; i++) {
                result.push(element);
                element = element.nextElementSibling as any;
            }
            return result;
        } else {
            return [element];
        }
    }
}
