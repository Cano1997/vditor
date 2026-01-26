/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constants } from "../constants";
import {getEventName} from "../util/compatibility";
import { getEditorRange } from "../util/selection";
import {MenuItem} from "./MenuItem";
import {hidePanel, toggleSubMenu} from "./setToolbar";

export class BgColor extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        const actionBtn = this.element.children[0] as HTMLElement;
        const panelElement = document.createElement("div");
        panelElement.className = `vditor-hint${menuItem.level === 2 ? "" : " vditor-panel--arrow"}`;
        panelElement.innerHTML = `<ul class="vditor-color">
        <li data-value="0" class="clear">
            <svg viewBox="0 0 1024 1024"><path d="M236.8 128L896 787.2V128H236.8z m614.4 704L192 172.8V832h659.2zM192 64h704c38.4 0 64 25.6 64 64v704c0 38.4-25.6 64-64 64H192c-38.4 0-64-25.6-64-64V128c0-38.4 25.6-64 64-64z"></path></svg>
            清除背景色
        </li>
        <li data-value="rgb(0, 0, 0)"><div class="color-block" data-value="rgb(0, 0, 0)" style="background-color: rgb(0, 0, 0);"></div></li>
        <li data-value="rgb(38, 38, 38)"><div class="color-block" data-value="rgb(38, 38, 38)" style="background-color: rgb(38, 38, 38);"></div></li>
        <li data-value="rgb(89, 89, 89)"><div class="color-block" data-value="rgb(89, 89, 89)" style="background-color: rgb(89, 89, 89);"></div></li>
        <li data-value="rgb(140, 140, 140)"><div class="color-block" data-value="rgb(140, 140, 140)" style="background-color: rgb(140, 140, 140);"></div></li>
        <li data-value="rgb(191, 191, 191)"><div class="color-block" data-value="rgb(191, 191, 191)" style="background-color: rgb(191, 191, 191);"></div></li>
        <li data-value="rgb(217, 217, 217)"><div class="color-block" data-value="rgb(217, 217, 217)" style="background-color: rgb(217, 217, 217);"></div></li>
        <li data-value="rgb(233, 233, 233)"><div class="color-block" data-value="rgb(233, 233, 233)" style="background-color: rgb(233, 233, 233);"></div></li>
        <li data-value="rgb(245, 245, 245)"><div class="color-block" data-value="rgb(245, 245, 245)" style="background-color: rgb(245, 245, 245);"></div></li>
        <li data-value="rgb(250, 250, 250)"><div class="color-block" data-value="rgb(250, 250, 250)" style="background-color: rgb(250, 250, 250);"></div></li>
        <li data-value="rgb(255, 255, 255)"><div class="color-block" data-value="rgb(255, 255, 255)" style="background-color: rgb(255, 255, 255);"></div></li>
        <li data-value="rgb(225, 60, 57)"><div class="color-block" data-value="rgb(225, 60, 57)" style="background-color: rgb(225, 60, 57);"></div></li>
        <li data-value="rgb(231, 95, 51)"><div class="color-block" data-value="rgb(231, 95, 51)" style="background-color: rgb(231, 95, 51);"></div></li>
        <li data-value="rgb(235, 144, 58)"><div class="color-block" data-value="rgb(235, 144, 58)" style="background-color: rgb(235, 144, 58);"></div></li>
        <li data-value="rgb(245, 219, 77)"><div class="color-block" data-value="rgb(245, 219, 77)" style="background-color: rgb(245, 219, 77);"></div></li>
        <li data-value="rgb(114, 192, 64)"><div class="color-block" data-value="rgb(114, 192, 64)" style="background-color: rgb(114, 192, 64);"></div></li>
        <li data-value="rgb(89, 191, 192)"><div class="color-block" data-value="rgb(89, 191, 192)" style="background-color: rgb(89, 191, 192);"></div></li>
        <li data-value="rgb(66, 144, 247)"><div class="color-block" data-value="rgb(66, 144, 247)" style="background-color: rgb(66, 144, 247);"></div></li>
        <li data-value="rgb(54, 88, 226)"><div class="color-block" data-value="rgb(54, 88, 226)" style="background-color: rgb(54, 88, 226);"></div></li>
        <li data-value="rgb(106, 57, 201)"><div class="color-block" data-value="rgb(106, 57, 201)" style="background-color: rgb(106, 57, 201);"></div></li>
        <li data-value="rgb(216, 68, 147)"><div class="color-block" data-value="rgb(216, 68, 147)" style="background-color: rgb(216, 68, 147);"></div></li>
        <li data-value="rgb(251, 233, 230)"><div class="color-block" data-value="rgb(251, 233, 230)" style="background-color: rgb(251, 233, 230);"></div></li>
        <li data-value="rgb(252, 237, 225)"><div class="color-block" data-value="rgb(252, 237, 225)" style="background-color: rgb(252, 237, 225);"></div></li>
        <li data-value="rgb(252, 239, 212)"><div class="color-block" data-value="rgb(252, 239, 212)" style="background-color: rgb(252, 239, 212);"></div></li>
        <li data-value="rgb(252, 251, 207)"><div class="color-block" data-value="rgb(252, 251, 207)" style="background-color: rgb(252, 251, 207);"></div></li>
        <li data-value="rgb(231, 246, 213)"><div class="color-block" data-value="rgb(231, 246, 213)" style="background-color: rgb(231, 246, 213);"></div></li>
        <li data-value="rgb(218, 244, 240)"><div class="color-block" data-value="rgb(218, 244, 240)" style="background-color: rgb(218, 244, 240);"></div></li>
        <li data-value="rgb(217, 237, 250)"><div class="color-block" data-value="rgb(217, 237, 250)" style="background-color: rgb(217, 237, 250);"></div></li>
        <li data-value="rgb(224, 232, 250)"><div class="color-block" data-value="rgb(224, 232, 250)" style="background-color: rgb(224, 232, 250);"></div></li>
        <li data-value="rgb(237, 225, 248)"><div class="color-block" data-value="rgb(237, 225, 248)" style="background-color: rgb(237, 225, 248);"></div></li>
        <li data-value="rgb(246, 226, 234)"><div class="color-block" data-value="rgb(246, 226, 234)" style="background-color: rgb(246, 226, 234);"></div></li>
        <li data-value="rgb(255, 163, 158)"><div class="color-block" data-value="rgb(255, 163, 158)" style="background-color: rgb(255, 163, 158);"></div></li>
        <li data-value="rgb(255, 187, 150)"><div class="color-block" data-value="rgb(255, 187, 150)" style="background-color: rgb(255, 187, 150);"></div></li>
        <li data-value="rgb(255, 213, 145)"><div class="color-block" data-value="rgb(255, 213, 145)" style="background-color: rgb(255, 213, 145);"></div></li>
        <li data-value="rgb(255, 251, 143)"><div class="color-block" data-value="rgb(255, 251, 143)" style="background-color: rgb(255, 251, 143);"></div></li>
        <li data-value="rgb(183, 235, 143)"><div class="color-block" data-value="rgb(183, 235, 143)" style="background-color: rgb(183, 235, 143);"></div></li>
        <li data-value="rgb(135, 232, 222)"><div class="color-block" data-value="rgb(135, 232, 222)" style="background-color: rgb(135, 232, 222);"></div></li>
        <li data-value="rgb(145, 213, 255)"><div class="color-block" data-value="rgb(145, 213, 255)" style="background-color: rgb(145, 213, 255);"></div></li>
        <li data-value="rgb(173, 198, 255)"><div class="color-block" data-value="rgb(173, 198, 255)" style="background-color: rgb(173, 198, 255);"></div></li>
        <li data-value="rgb(211, 173, 247)"><div class="color-block" data-value="rgb(211, 173, 247)" style="background-color: rgb(211, 173, 247);"></div></li>
        <li data-value="rgb(255, 173, 210)"><div class="color-block" data-value="rgb(255, 173, 210)" style="background-color: rgb(255, 173, 210);"></div></li>
        <li data-value="rgb(255, 77, 79)"><div class="color-block" data-value="rgb(255, 77, 79)" style="background-color: rgb(255, 77, 79);"></div></li>
        <li data-value="rgb(255, 122, 69)"><div class="color-block" data-value="rgb(255, 122, 69)" style="background-color: rgb(255, 122, 69);"></div></li>
        <li data-value="rgb(255, 169, 64)"><div class="color-block" data-value="rgb(255, 169, 64)" style="background-color: rgb(255, 169, 64);"></div></li>
        <li data-value="rgb(255, 236, 61)"><div class="color-block" data-value="rgb(255, 236, 61)" style="background-color: rgb(255, 236, 61);"></div></li>
        <li data-value="rgb(115, 209, 61)"><div class="color-block" data-value="rgb(115, 209, 61)" style="background-color: rgb(115, 209, 61);"></div></li>
        <li data-value="rgb(54, 207, 201)"><div class="color-block" data-value="rgb(54, 207, 201)" style="background-color: rgb(54, 207, 201);"></div></li>
        <li data-value="rgb(64, 169, 255)"><div class="color-block" data-value="rgb(64, 169, 255)" style="background-color: rgb(64, 169, 255);"></div></li>
        <li data-value="rgb(89, 126, 247)"><div class="color-block" data-value="rgb(89, 126, 247)" style="background-color: rgb(89, 126, 247);"></div></li>
        <li data-value="rgb(146, 84, 222)"><div class="color-block" data-value="rgb(146, 84, 222)" style="background-color: rgb(146, 84, 222);"></div></li>
        <li data-value="rgb(247, 89, 171)"><div class="color-block" data-value="rgb(247, 89, 171)" style="background-color: rgb(247, 89, 171);"></div></li>
        <li data-value="rgb(207, 19, 34)"><div class="color-block" data-value="rgb(207, 19, 34)" style="background-color: rgb(207, 19, 34);"></div></li>
        <li data-value="rgb(212, 56, 13)"><div class="color-block" data-value="rgb(212, 56, 13)" style="background-color: rgb(212, 56, 13);"></div></li>
        <li data-value="rgb(212, 107, 8)"><div class="color-block" data-value="rgb(212, 107, 8)" style="background-color: rgb(212, 107, 8);"></div></li>
        <li data-value="rgb(212, 177, 6)"><div class="color-block" data-value="rgb(212, 177, 6)" style="background-color: rgb(212, 177, 6);"></div></li>
        <li data-value="rgb(56, 158, 13)"><div class="color-block" data-value="rgb(56, 158, 13)" style="background-color: rgb(56, 158, 13);"></div></li>
        <li data-value="rgb(8, 151, 156)"><div class="color-block" data-value="rgb(8, 151, 156)" style="background-color: rgb(8, 151, 156);"></div></li>
        <li data-value="rgb(9, 109, 217)"><div class="color-block" data-value="rgb(9, 109, 217)" style="background-color: rgb(9, 109, 217);"></div></li>
        <li data-value="rgb(29, 57, 196)"><div class="color-block" data-value="rgb(29, 57, 196)" style="background-color: rgb(29, 57, 196);"></div></li>
        <li data-value="rgb(83, 29, 171)"><div class="color-block" data-value="rgb(83, 29, 171)" style="background-color: rgb(83, 29, 171);"></div></li>
        <li data-value="rgb(196, 29, 127)"><div class="color-block" data-value="rgb(196, 29, 127)" style="background-color: rgb(196, 29, 127);"></div></li>
        <li data-value="rgb(130, 0, 20)"><div class="color-block" data-value="rgb(130, 0, 20)" style="background-color: rgb(130, 0, 20);"></div></li>
        <li data-value="rgb(135, 20, 0)"><div class="color-block" data-value="rgb(135, 20, 0)" style="background-color: rgb(135, 20, 0);"></div></li>
        <li data-value="rgb(135, 56, 0)"><div class="color-block" data-value="rgb(135, 56, 0)" style="background-color: rgb(135, 56, 0);"></div></li>
        <li data-value="rgb(97, 71, 0)"><div class="color-block" data-value="rgb(97, 71, 0)" style="background-color: rgb(97, 71, 0);"></div></li>
        <li data-value="rgb(19, 82, 0)"><div class="color-block" data-value="rgb(19, 82, 0)" style="background-color: rgb(19, 82, 0);"></div></li>
        <li data-value="rgb(0, 71, 79)"><div class="color-block" data-value="rgb(0, 71, 79)" style="background-color: rgb(0, 71, 79);"></div></li>
        <li data-value="rgb(0, 58, 140)"><div class="color-block" data-value="rgb(0, 58, 140)" style="background-color: rgb(0, 58, 140);"></div></li>
        <li data-value="rgb(6, 17, 120)"><div class="color-block" data-value="rgb(6, 17, 120)" style="background-color: rgb(6, 17, 120);"></div></li>
        <li data-value="rgb(34, 7, 94)"><div class="color-block" data-value="rgb(34, 7, 94)" style="background-color: rgb(34, 7, 94);"></div></li>
        <li data-value="rgb(120, 6, 80)"><div class="color-block" data-value="rgb(120, 6, 80)" style="background-color: rgb(120, 6, 80);"></div></li>
        </ul>`;
        panelElement.addEventListener(getEventName(), (event: MouseEvent & { target: HTMLElement }) => {
            const element = event.target;
            const color = element.getAttribute("data-value");
            const range = getEditorRange(vditor);
            const nodes = this.getRangeNodes(range);
            const text = range.toString();
            // 默认颜色
            if (color === '0') {
                nodes.forEach((node, index) => {
                    const textContent = node.textContent;
                    const style = node.getAttribute('style');
                    const styles = style ? style.split(';') : [];
                    const styleIndex = styles.findIndex(item => item.includes('background-color'));
                    if (styleIndex > -1) {
                        styles.splice(styleIndex, 1);
                    }
                    if (!text) {
                        node.outerHTML = `<span style="${styles.join(';')}">${textContent}</span>`;
                    } else if (index === 0) {
                        let html = `${textContent.slice(range.startOffset)}`;
                        if (styles.length) {
                            html = `<span style="${styles.join(';')}">${html}</span>`;
                        }
                        node.textContent = textContent.slice(0, range.startOffset);
                        node.insertAdjacentHTML('afterend', html);
                    } else if (index === nodes.length - 1) {
                        let html = textContent.slice(0, range.endOffset);
                        if (styles.length) {
                            html = `<span style="${styles.join(';')}">${html}</span>`;
                        }
                        node.textContent = textContent.slice(range.endOffset);
                        node.insertAdjacentHTML('beforebegin', html);
                    } else {
                        let html = node.textContent;
                        if (styles.length) {
                            html = `<span style="${styles.join(';')}">${html}</span>`;
                        }
                        node.insertAdjacentHTML('beforebegin', html);
                        node.textContent = '';
                    }
                    // 节点不存在则删除
                    if (!node.textContent) {
                        node.remove();
                    }
                });
            } else {
                if (nodes.length > 1) {
                    nodes.forEach((node, index) => {
                        const style = node.getAttribute('style');
                        const styles = style ? style.split(';') : [];
                        const styleIndex = styles.findIndex(item => item.includes('background-color'));
                        if (styleIndex > -1) {
                            styles.splice(styleIndex, 1);
                        }
                        const textContent = node.textContent;
                        // 在第一个节点后添加颜色节点
                        if (index === 0) {
                            let html = `${textContent.slice(range.startOffset)}`;
                            if (styles.length) {
                                html = `<span style="background-color: ${color};${styles.join(';')}">${html}</span>`;
                            }
                            node.insertAdjacentHTML('afterend', html);
                            node.textContent = node.textContent.slice(0, range.startOffset);
                        } else if (index === nodes.length - 1) {
                            let html = textContent.slice(0, range.endOffset);
                            if (styles.length) {
                                html = `<span style="background-color: ${color};${styles.join(';')}">${html}</span>`;
                            }
                            node.insertAdjacentHTML('beforebegin', html);
                            node.textContent = node.textContent.slice(range.endOffset);
                        } else {
                            let html = node.textContent;
                            if (styles.length) {
                                html = `<span style="background-color: ${color};${styles.join(';')}">${html}</span>`;
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
                    const styleIndex = styles.findIndex(item => item.includes('background-color'));
                    if (styleIndex > -1) {
                        styles.splice(styleIndex, 1);
                    }
                    const curColor = node.style.backgroundColor;
                    const textContent = node.textContent;
                    // 添加颜色
                    if (!curColor) {
                        if (textContent) {
                            node.outerHTML = node.innerHTML.replace(textContent, `<span style="background-color: ${color};${styles.join(';')}">${textContent}</span>`);
                        } else {
                            node.outerHTML = `<span style="background-color: ${color}">${Constants.ZWSP}</span>`;
                        }
                    } else {
                        // 修改颜色
                        if (!text) {
                            node.outerHTML = `<span style="background-color: ${color};${styles.join(';')}">${textContent}</span>`;
                        } else if (textContent === text) {
                            node.insertAdjacentHTML('beforebegin', `<span style="background-color: ${color};${styles.join(';')}">${text}</span>`);
                            node.remove();
                        } else if (textContent.includes(text)) {
                            // 节点包含选中文本时，添加文本
                            if (textContent.startsWith(text)) {
                                node.insertAdjacentHTML('beforebegin', `<span style="background-color: ${color};${styles.join(';')}">${text}</span>`);
                                node.innerHTML = node.innerHTML.replace(text, '');
                            } else if (textContent.endsWith(text)) {
                                node.insertAdjacentHTML('afterend', `<span style="background-color: ${color};${styles.join(';')}">${text}</span>`);
                                node.innerHTML = node.innerHTML.replace(text, '');
                            } else {
                                const [ textBefore, textAfter ] = textContent.split(text);
                                node.insertAdjacentHTML('beforebegin', `<span style="background-color: ${curColor};${styles.join(';')}">${textBefore}</span>`);
                                node.insertAdjacentHTML('afterend', `<span style="background-color: ${curColor};${styles.join(';')}">${textAfter}</span>`);
                                node.innerHTML = `<span style="background-color: ${color};${styles.join(';')}">${text}</span>`;
                            }
                        }
                    }
                }
            }
            
            hidePanel(vditor, ["subToolbar"]);
            event.preventDefault();
            event.stopPropagation();
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
