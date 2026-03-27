import { Constants } from "../constants";
import { getEditorRange } from "./selection";

export class StyleManager {

    // 通用设置样式
    setStyle(
        vditor: IVditor,
        property: string,
        value: string
    ) {
        const range =
            getEditorRange(vditor);
        if (!range) return;

        // 未选中字符时，插入一个零宽字符
        if (range.collapsed) {
            const span =
                document.createElement("span");
            span.style.setProperty(
                property,
                value
            );
            span.textContent = Constants.ZWSP;
            range.insertNode(span);
            const newRange =
                document.createRange();
            newRange.setStart(
                span.firstChild!,
                1
            );
            newRange.collapse(true);
            const selection =
                window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(newRange);
            return;
        }

        this.splitRange(range);
        const nodes =
            this.getRangeTextNodes(range);
        nodes.forEach(node => {
            const oldParent =
                node.parentElement;
            // 继承之前节点的样式，防止样式丢失
            const span =
                document.createElement("span");
            if (
                oldParent &&
                oldParent.tagName === "SPAN"
            ) {
                const style =
                    oldParent.getAttribute("style");
                if (style) {
                    span.setAttribute(
                        "style",
                        style
                    );
                }
            }

            // 覆盖样式属性
            span.style.setProperty(
                property,
                value
            );
            node.parentNode?.replaceChild(
                span,
                node
            );
            span.appendChild(node);
        });

        this.normalize(
            vditor[vditor.currentMode].element
        );
    }

    // 清除样式
    clearStyle(
        vditor: IVditor,
        property: string
    ) {
        const range =
            getEditorRange(vditor);
        if (!range) return;
        this.splitRange(range);
        const nodes =
            this.getRangeTextNodes(range);
        nodes.forEach(node => {
            let parent =
                node.parentElement;
            while (
                parent &&
                parent.tagName === "SPAN"
            ) {
                parent.style.removeProperty(
                    property
                );
                if (
                    !parent.getAttribute("style")
                ) {
                    const temp = parent;
                    parent =
                        parent.parentElement;
                    this.unwrap(temp);
                } else {
                    break;
                }
            }
        });
        this.normalize(
            vditor[vditor.currentMode].element
        );
    }

    // 分隔选中节点
    private splitRange(range: Range) {
        let startNode = range.startContainer;
        const endNode = range.endContainer;
        if (
            endNode instanceof Text &&
            range.endOffset > 0 &&
            range.endOffset < endNode.length
        ) {
            const newEnd =
                endNode.splitText(
                    range.endOffset
                );
            range.setEndBefore(newEnd);
        }
        startNode = range.startContainer;
        if (
            startNode instanceof Text &&
            range.startOffset > 0 &&
            range.startOffset < startNode.length
        ) {
            const newStart =
                startNode.splitText(
                    range.startOffset
                );
            range.setStart(
                newStart,
                0
            );
        }
    }

    // 获取选区内的文本节点
    private getRangeTextNodes(
        range: Range
    ): Text[] {
        const nodes: Text[] = [];
        let root =
            range.commonAncestorContainer;
        if (
            root.nodeType === Node.TEXT_NODE
        ) {
            root = root.parentNode!;
        }
        const walker =
            document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        if (
                            !node.textContent ||
                            node.textContent.trim() === ""
                        ) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (
                            range.intersectsNode(node)
                        ) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        return NodeFilter.FILTER_REJECT;
                    }
                }
            );

        let node =
            walker.nextNode();
        while (node) {
            nodes.push(
                node as Text
            );
            node =
                walker.nextNode();
        }
        return nodes;
    }

    
    // 格式化样式节点
    private normalize(
        root: HTMLElement
    ) {
        this.mergeAdjacentSpan(root);
        this.removeEmptySpan(root);
        this.removeZWSP(root);
    }

    // 合并相邻的 span
    private mergeAdjacentSpan(
        root: HTMLElement
    ) {
        const spans =
            root.querySelectorAll("span[style*='']");
        spans.forEach(span => {
            let next =
                span.nextSibling;
            while (
                next instanceof HTMLElement &&
                next.tagName === "SPAN" &&
                next.getAttribute("style")
                === span.getAttribute("style")
            ) {
                span.appendChild(
                    next.firstChild!
                );
                next.remove();
                next = span.nextSibling;
            }
        });
    }

    // 删除空 span
    private removeEmptySpan(
        root: HTMLElement
    ) {
        const spans =
            root.querySelectorAll("span");
        spans.forEach(span => {
            if (
                !span.textContent
            ) {
                span.remove();
                return;
            }
            if (
                !span.getAttribute("style") && span.classList.length === 0
            ) {
                this.unwrap(span);
            }

        });
    }

    // 删除 span 标签，保留文本
    private unwrap(
        element: HTMLElement
    ) {
        const parent =
            element.parentNode;
        if (!parent) return;
        while (
            element.firstChild
        ) {
            parent.insertBefore(
                element.firstChild,
                element
            );

        }
        parent.removeChild(element);
    }

    // 清理 ZWSP
    private removeZWSP(
        root: HTMLElement
    ) {
        const walker =
            document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT
            );
        let node =
            walker.nextNode();
        while (node) {
            node.textContent =
                node.textContent?.replace(
                    /\u200B/g,
                    ""
                ) || "";
            node =
                walker.nextNode();
        }
    }
}