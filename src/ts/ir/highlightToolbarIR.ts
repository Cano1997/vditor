import { Constants } from "../constants";
import { getMarkdown } from "../markdown/getMarkdown";
import {
    disableToolbar,
    enableToolbar,
    removeCurrentToolbar,
    setCurrentToolbar,
} from "../toolbar/setToolbar";
import { isCtrl, updateHotkeyTip } from "../util/compatibility";
import { scrollCenter } from "../util/editorCommonEvent";
import { deleteColumn, deleteRow, insertColumn, insertRow, insertRowAbove, setTableAlign } from "../util/fixBrowserBehavior";
import {
    hasClosestByAttribute,
    hasClosestByMatchTag,
} from "../util/hasClosest";
import { hasClosestByHeadings } from "../util/hasClosestByHeadings";
import { getEditorRange, selectIsEditor, setRangeByWbr, setSelectionFocus } from "../util/selection";
import { renderToc } from "../util/toc";
import { afterRenderEvent } from "./afterRenderEvent";
import { removeBlockElement } from "./processKeydown";

export const highlightToolbarIR = (vditor: IVditor) => {
    clearTimeout(vditor[vditor.currentMode].hlToolbarTimeoutId);
    vditor[vditor.currentMode].hlToolbarTimeoutId = window.setTimeout(() => {
        if (
            vditor[vditor.currentMode].element.getAttribute(
                "contenteditable"
            ) === "false"
        ) {
            return;
        }
        if (!selectIsEditor(vditor[vditor.currentMode].element)) {
            return;
        }

        removeCurrentToolbar(vditor.toolbar.elements, Constants.EDIT_TOOLBARS);
        enableToolbar(vditor.toolbar.elements, Constants.EDIT_TOOLBARS);
        vditor.ir.popover.innerHTML = "";

        const range = getEditorRange(vditor);
        let typeElement = range.startContainer as HTMLElement;
        if (range.startContainer.nodeType === 3) {
            typeElement = range.startContainer.parentElement;
        }
        if (typeElement.classList.contains("vditor-reset")) {
            typeElement = typeElement.childNodes[
                range.startOffset
            ] as HTMLElement;
        }

        const headingElement =
            vditor.currentMode === "sv"
                ? hasClosestByAttribute(typeElement, "data-type", "heading")
                : hasClosestByHeadings(typeElement);
        if (headingElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["headings"]);
        }

        const quoteElement =
            vditor.currentMode === "sv"
                ? hasClosestByAttribute(typeElement, "data-type", "blockquote")
                : hasClosestByMatchTag(typeElement, "BLOCKQUOTE");
        if (quoteElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["quote"]);
        }

        const strongElement = hasClosestByAttribute(
            typeElement,
            "data-type",
            "strong"
        );
        if (strongElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["bold"]);
        }

        const emElement = hasClosestByAttribute(typeElement, "data-type", "em");
        if (emElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["italic"]);
        }

        const sElement = hasClosestByAttribute(typeElement, "data-type", "s");
        if (sElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["strike"]);
        }

        const aElement = hasClosestByAttribute(typeElement, "data-type", "a");
        if (aElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["link"]);
        }

        const liElement = hasClosestByMatchTag(typeElement, "LI");
        if (liElement) {
            if (liElement.classList.contains("vditor-task")) {
                setCurrentToolbar(vditor.toolbar.elements, ["check"]);
            } else if (liElement.parentElement.tagName === "OL") {
                setCurrentToolbar(vditor.toolbar.elements, ["ordered-list"]);
            } else if (liElement.parentElement.tagName === "UL") {
                setCurrentToolbar(vditor.toolbar.elements, ["list"]);
            }
            enableToolbar(vditor.toolbar.elements, ["outdent", "indent"]);
        } else {
            disableToolbar(vditor.toolbar.elements, ["outdent", "indent"]);
        }

        const codeBlockElement = hasClosestByAttribute(
            typeElement,
            "data-type",
            "code-block"
        );
        if (codeBlockElement) {
            disableToolbar(vditor.toolbar.elements, [
                "headings",
                "bold",
                "italic",
                "strike",
                "line",
                "quote",
                "list",
                "ordered-list",
                "check",
                "code",
                "inline-code",
                "upload",
                "link",
                "table",
                "record",
            ]);
            setCurrentToolbar(vditor.toolbar.elements, ["code"]);
        }

        const codeElement = hasClosestByAttribute(
            typeElement,
            "data-type",
            "code"
        );
        if (codeElement) {
            disableToolbar(vditor.toolbar.elements, [
                "headings",
                "bold",
                "italic",
                "strike",
                "line",
                "quote",
                "list",
                "ordered-list",
                "check",
                "code",
                "upload",
                "link",
                "table",
                "record",
            ]);
            setCurrentToolbar(vditor.toolbar.elements, ["inline-code"]);
        }

        const tableElement = hasClosestByAttribute(
            typeElement,
            "data-type",
            "table"
        ) as HTMLTableElement;
        if (tableElement) {
            disableToolbar(vditor.toolbar.elements, [
                "headings",
                "list",
                "ordered-list",
                "check",
                "line",
                "quote",
                "code",
                "table",
            ]);
        }
        if (tableElement) {
            vditor.ir.popover.innerHTML = "";
            const updateTable = () => {
                const oldRow = tableElement.rows.length;
                const oldColumn = tableElement.rows[0].cells.length;
                const row = parseInt(input.value, 10) || oldRow;
                const column = parseInt(input2.value, 10) || oldColumn;

                if (row === oldRow && oldColumn === column) {
                    return;
                }

                if (oldColumn !== column) {
                    const columnDiff = column - oldColumn;
                    for (let i = 0; i < tableElement.rows.length; i++) {
                        if (columnDiff > 0) {
                            for (let j = 0; j < columnDiff; j++) {
                                if (i === 0) {
                                    tableElement.rows[
                                        i
                                    ].lastElementChild.insertAdjacentHTML(
                                        "afterend",
                                        "<th> </th>"
                                    );
                                } else {
                                    tableElement.rows[
                                        i
                                    ].lastElementChild.insertAdjacentHTML(
                                        "afterend",
                                        "<td> </td>"
                                    );
                                }
                            }
                        } else {
                            for (let k = oldColumn - 1; k >= column; k--) {
                                tableElement.rows[i].cells[k].remove();
                            }
                        }
                    }
                }

                if (oldRow !== row) {
                    const rowDiff = row - oldRow;
                    if (rowDiff > 0) {
                        let rowHTML = "<tr>";
                        for (let m = 0; m < column; m++) {
                            rowHTML += "<td> </td>";
                        }
                        for (let l = 0; l < rowDiff; l++) {
                            if (tableElement.querySelector("tbody")) {
                                tableElement
                                    .querySelector("tbody")
                                    .insertAdjacentHTML("beforeend", rowHTML);
                            } else {
                                tableElement
                                    .querySelector("thead")
                                    .insertAdjacentHTML(
                                        "afterend",
                                        rowHTML + "</tr>"
                                    );
                            }
                        }
                    } else {
                        for (let m = oldRow - 1; m >= row; m--) {
                            tableElement.rows[m].remove();
                            if (tableElement.rows.length === 1) {
                                tableElement.querySelector("tbody").remove();
                            }
                        }
                    }
                }
                if (typeof vditor.options.input === "function") {
                    vditor.options.input(getMarkdown(vditor));
                }
            };

            const setAlign = (type: string) => {
                setTableAlign(tableElement, type);
                if (type === "right") {
                    left.classList.remove("vditor-icon--current");
                    center.classList.remove("vditor-icon--current");
                    right.classList.add("vditor-icon--current");
                } else if (type === "center") {
                    left.classList.remove("vditor-icon--current");
                    right.classList.remove("vditor-icon--current");
                    center.classList.add("vditor-icon--current");
                } else {
                    center.classList.remove("vditor-icon--current");
                    right.classList.remove("vditor-icon--current");
                    left.classList.add("vditor-icon--current");
                }
                setSelectionFocus(range);
            };

            const td = hasClosestByMatchTag(typeElement, "TD");
            const th = hasClosestByMatchTag(typeElement, "TH");
            let alignType = "left";
            if (td) {
                alignType = td.getAttribute("align") || "left";
            } else if (th) {
                alignType = th.getAttribute("align") || "center";
            }

            const left = document.createElement("button");
            left.setAttribute("type", "button");
            left.setAttribute(
                "aria-label",
                window.VditorI18n.alignLeft + "<" + updateHotkeyTip("⇧⌘L") + ">"
            );
            left.setAttribute("data-type", "left");
            left.innerHTML =
                '<svg><use xlink:href="#vditor-icon-align-left"></use></svg>';
            left.className =
                "vditor-icon vditor-tooltipped vditor-tooltipped__n" +
                (alignType === "left" ? " vditor-icon--current" : "");
            left.onclick = () => {
                setAlign("left");
            };

            const center = document.createElement("button");
            center.setAttribute("type", "button");
            center.setAttribute(
                "aria-label",
                window.VditorI18n.alignCenter +
                    "<" +
                    updateHotkeyTip("⇧⌘C") +
                    ">"
            );
            center.setAttribute("data-type", "center");
            center.innerHTML =
                '<svg><use xlink:href="#vditor-icon-align-center"></use></svg>';
            center.className =
                "vditor-icon vditor-tooltipped vditor-tooltipped__n" +
                (alignType === "center" ? " vditor-icon--current" : "");
            center.onclick = () => {
                setAlign("center");
            };

            const right = document.createElement("button");
            right.setAttribute("type", "button");
            right.setAttribute(
                "aria-label",
                window.VditorI18n.alignRight +
                    "<" +
                    updateHotkeyTip("⇧⌘R") +
                    ">"
            );
            right.setAttribute("data-type", "right");
            right.innerHTML =
                '<svg><use xlink:href="#vditor-icon-align-right"></use></svg>';
            right.className =
                "vditor-icon vditor-tooltipped vditor-tooltipped__n" +
                (alignType === "right" ? " vditor-icon--current" : "");
            right.onclick = () => {
                setAlign("right");
            };

            const insertRowElement = document.createElement("button");
            insertRowElement.setAttribute("type", "button");
            insertRowElement.setAttribute(
                "aria-label",
                window.VditorI18n.insertRowBelow +
                    "<" +
                    updateHotkeyTip("⌘=") +
                    ">"
            );
            insertRowElement.setAttribute("data-type", "insertRow");
            insertRowElement.innerHTML =
                '<svg><use xlink:href="#vditor-icon-insert-row"></use></svg>';
            insertRowElement.className =
                "vditor-icon vditor-tooltipped vditor-tooltipped__n";
            insertRowElement.onclick = () => {
                const startContainer =
                    getSelection().getRangeAt(0).startContainer;
                const cellElement =
                    hasClosestByMatchTag(startContainer, "TD") ||
                    hasClosestByMatchTag(startContainer, "TH");
                if (cellElement) {
                    insertRow(vditor, range, cellElement);
                }
            };

            const insertRowBElement = document.createElement("button");
            insertRowBElement.setAttribute("type", "button");
            insertRowBElement.setAttribute(
                "aria-label",
                window.VditorI18n.insertRowAbove +
                    "<" +
                    updateHotkeyTip("⇧⌘F") +
                    ">"
            );
            insertRowBElement.setAttribute("data-type", "insertRow");
            insertRowBElement.innerHTML =
                '<svg><use xlink:href="#vditor-icon-insert-rowb"></use></svg>';
            insertRowBElement.className =
                "vditor-icon vditor-tooltipped vditor-tooltipped__n";
            insertRowBElement.onclick = () => {
                const startContainer =
                    getSelection().getRangeAt(0).startContainer;
                const cellElement =
                    hasClosestByMatchTag(startContainer, "TD") ||
                    hasClosestByMatchTag(startContainer, "TH");
                if (cellElement) {
                    insertRowAbove(vditor, range, cellElement);
                }
            };

            const insertColumnElement = document.createElement("button");
            insertColumnElement.setAttribute("type", "button");
            insertColumnElement.setAttribute(
                "aria-label",
                window.VditorI18n.insertColumnRight +
                    "<" +
                    updateHotkeyTip("⇧⌘=") +
                    ">"
            );
            insertColumnElement.setAttribute("data-type", "insertColumn");
            insertColumnElement.innerHTML =
                '<svg><use xlink:href="#vditor-icon-insert-column"></use></svg>';
            insertColumnElement.className =
                "vditor-icon vditor-tooltipped vditor-tooltipped__n";
            insertColumnElement.onclick = () => {
                const startContainer =
                    getSelection().getRangeAt(0).startContainer;
                const cellElement =
                    hasClosestByMatchTag(startContainer, "TD") ||
                    hasClosestByMatchTag(startContainer, "TH");
                if (cellElement) {
                    insertColumn(vditor, tableElement, cellElement);
                }
            };

            const insertColumnBElement = document.createElement("button");
            insertColumnBElement.setAttribute("type", "button");
            insertColumnBElement.setAttribute(
                "aria-label",
                window.VditorI18n.insertColumnLeft +
                    "<" +
                    updateHotkeyTip("⇧⌘G") +
                    ">"
            );
            insertColumnBElement.setAttribute("data-type", "insertColumn");
            insertColumnBElement.innerHTML =
                '<svg><use xlink:href="#vditor-icon-insert-columnb"></use></svg>';
            insertColumnBElement.className =
                "vditor-icon vditor-tooltipped vditor-tooltipped__n";
            insertColumnBElement.onclick = () => {
                const startContainer =
                    getSelection().getRangeAt(0).startContainer;
                const cellElement =
                    hasClosestByMatchTag(startContainer, "TD") ||
                    hasClosestByMatchTag(startContainer, "TH");
                if (cellElement) {
                    insertColumn(
                        vditor,
                        tableElement,
                        cellElement,
                        "beforebegin"
                    );
                }
            };

            const deleteRowElement = document.createElement("button");
            deleteRowElement.setAttribute("type", "button");
            deleteRowElement.setAttribute(
                "aria-label",
                window.VditorI18n["delete-row"] +
                    "<" +
                    updateHotkeyTip("⌘-") +
                    ">"
            );
            deleteRowElement.setAttribute("data-type", "deleteRow");
            deleteRowElement.innerHTML =
                '<svg><use xlink:href="#vditor-icon-delete-row"></use></svg>';
            deleteRowElement.className =
                "vditor-icon vditor-tooltipped vditor-tooltipped__n";
            deleteRowElement.onclick = () => {
                const startContainer =
                    getSelection().getRangeAt(0).startContainer;
                const cellElement =
                    hasClosestByMatchTag(startContainer, "TD") ||
                    hasClosestByMatchTag(startContainer, "TH");
                if (cellElement) {
                    deleteRow(vditor, range, cellElement);
                }
            };

            const deleteColumnElement = document.createElement("button");
            deleteColumnElement.setAttribute("type", "button");
            deleteColumnElement.setAttribute(
                "aria-label",
                window.VditorI18n["delete-column"] +
                    "<" +
                    updateHotkeyTip("⇧⌘-") +
                    ">"
            );
            deleteColumnElement.setAttribute("data-type", "deleteColumn");
            deleteColumnElement.innerHTML =
                '<svg><use xlink:href="#vditor-icon-delete-column"></use></svg>';
            deleteColumnElement.className =
                "vditor-icon vditor-tooltipped vditor-tooltipped__n";
            deleteColumnElement.onclick = () => {
                const startContainer =
                    getSelection().getRangeAt(0).startContainer;
                const cellElement =
                    hasClosestByMatchTag(startContainer, "TD") ||
                    hasClosestByMatchTag(startContainer, "TH");
                if (cellElement) {
                    deleteColumn(vditor, range, tableElement, cellElement);
                }
            };

            const inputWrap = document.createElement("span");
            inputWrap.setAttribute("aria-label", window.VditorI18n.row);
            inputWrap.className = "vditor-tooltipped vditor-tooltipped__n";
            const input = document.createElement("input");
            inputWrap.appendChild(input);
            input.type = "number";
            input.min = "1";
            input.className = "vditor-input";
            input.style.width = "42px";
            input.style.textAlign = "center";
            input.setAttribute("placeholder", window.VditorI18n.row);
            input.value = tableElement.rows.length.toString();
            input.oninput = () => {
                updateTable();
            };
            input.onkeydown = (event) => {
                if (event.isComposing) {
                    return;
                }
                if (event.key === "Tab") {
                    input2.focus();
                    input2.select();
                    event.preventDefault();
                    return;
                }
                if (removeBlockElement(vditor, event)) {
                    return;
                }
                if (focusToElement(event, range)) {
                    return;
                }
            };

            const input2Wrap = document.createElement("span");
            input2Wrap.setAttribute("aria-label", window.VditorI18n.column);
            input2Wrap.className = "vditor-tooltipped vditor-tooltipped__n";
            const input2 = document.createElement("input");
            input2Wrap.appendChild(input2);
            input2.type = "number";
            input2.min = "1";
            input2.className = "vditor-input";
            input2.style.width = "42px";
            input2.style.textAlign = "center";
            input2.setAttribute("placeholder", window.VditorI18n.column);
            input2.value = tableElement.rows[0].cells.length.toString();
            input2.oninput = () => {
                updateTable();
            };
            input2.onkeydown = (event) => {
                if (event.isComposing) {
                    return;
                }
                if (event.key === "Tab") {
                    input.focus();
                    input.select();
                    event.preventDefault();
                    return;
                }
                if (removeBlockElement(vditor, event)) {
                    return;
                }
                if (focusToElement(event, range)) {
                    return;
                }
            };

            genUp(range, tableElement, vditor);
            genDown(range, tableElement, vditor);
            genClose(tableElement, vditor);
            vditor.ir.popover.insertAdjacentElement("beforeend", left);
            vditor.ir.popover.insertAdjacentElement("beforeend", center);
            vditor.ir.popover.insertAdjacentElement("beforeend", right);
            vditor.ir.popover.insertAdjacentElement(
                "beforeend",
                insertRowBElement
            );
            vditor.ir.popover.insertAdjacentElement(
                "beforeend",
                insertRowElement
            );
            vditor.ir.popover.insertAdjacentElement(
                "beforeend",
                insertColumnBElement
            );
            vditor.ir.popover.insertAdjacentElement(
                "beforeend",
                insertColumnElement
            );
            vditor.ir.popover.insertAdjacentElement(
                "beforeend",
                deleteRowElement
            );
            vditor.ir.popover.insertAdjacentElement(
                "beforeend",
                deleteColumnElement
            );
            vditor.ir.popover.insertAdjacentElement(
                "beforeend",
                inputWrap
            );
            vditor.ir.popover.insertAdjacentHTML("beforeend", " x ");
            vditor.ir.popover.insertAdjacentElement(
                "beforeend",
                input2Wrap
            );
            customIrToolbar(vditor, "table");
            setPopoverPosition(vditor, tableElement);
        }
    }, 200);
};

const genUp = (range: Range, element: HTMLElement, vditor: IVditor) => {
    const previousElement = element.previousElementSibling;
    if (
        !previousElement ||
        (!element.parentElement.isEqualNode(vditor.ir.element) &&
            element.tagName !== "LI")
    ) {
        return;
    }
    const upElement = document.createElement("button");
    upElement.setAttribute("type", "button");
    upElement.setAttribute("data-type", "up");
    upElement.setAttribute("aria-label", window.VditorI18n.up + "<" + updateHotkeyTip("⇧⌘U") + ">");
    upElement.innerHTML = '<svg><use xlink:href="#vditor-icon-up"></use></svg>';
    upElement.className = "vditor-icon vditor-tooltipped vditor-tooltipped__n";
    upElement.onclick = () => {
        range.insertNode(document.createElement("wbr"));
        previousElement.insertAdjacentElement("beforebegin", element);
        setRangeByWbr(vditor.ir.element, range);
        afterRenderEvent(vditor);
        // highlightToolbarir(vditor);
        scrollCenter(vditor);
    };
    vditor.ir.popover.insertAdjacentElement("beforeend", upElement);
};

const genDown = (range: Range, element: HTMLElement, vditor: IVditor) => {
    const nextElement = element.nextElementSibling;
    if (
        !nextElement ||
        (!element.parentElement.isEqualNode(vditor.ir.element) &&
            element.tagName !== "LI")
    ) {
        return;
    }
    const downElement = document.createElement("button");
    downElement.setAttribute("type", "button");
    downElement.setAttribute("data-type", "down");
    downElement.setAttribute("aria-label", window.VditorI18n.down + "<" + updateHotkeyTip("⇧⌘D") + ">");
    downElement.innerHTML =
        '<svg><use xlink:href="#vditor-icon-down"></use></svg>';
    downElement.className =
        "vditor-icon vditor-tooltipped vditor-tooltipped__n";
    downElement.onclick = () => {
        range.insertNode(document.createElement("wbr"));
        nextElement.insertAdjacentElement("afterend", element);
        setRangeByWbr(vditor.ir.element, range);
        afterRenderEvent(vditor);
        // highlightToolbarir(vditor);
        scrollCenter(vditor);
    };
    vditor.ir.popover.insertAdjacentElement("beforeend", downElement);
};

const genClose = (element: HTMLElement, vditor: IVditor) => {
    const close = document.createElement("button");
    close.setAttribute("type", "button");
    close.setAttribute("data-type", "remove");
    close.setAttribute("aria-label", window.VditorI18n.remove + "<" + updateHotkeyTip("⇧⌘X") + ">");
    close.innerHTML =
        '<svg><use xlink:href="#vditor-icon-trashcan"></use></svg>';
    close.className = "vditor-icon vditor-tooltipped vditor-tooltipped__n";
    close.onclick = () => {
        const range = getEditorRange(vditor);
        range.setStartAfter(element);
        setSelectionFocus(range);
        element.remove();
        vditor.ir.popover.innerHTML = "";
        afterRenderEvent(vditor);
        // highlightToolbarir(vditor);
        if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(element.tagName)) {
            renderToc(vditor);
        }
    };
    vditor.ir.popover.insertAdjacentElement("beforeend", close);
};

const focusToElement = (event: KeyboardEvent, range: Range) => {
    if ((!isCtrl(event) && !event.shiftKey && event.key === "Enter") || event.key === "Escape") {
        if (range) {
            setSelectionFocus(range);
        }
        event.preventDefault();
        event.stopPropagation();
        return true;
    }
};

const customIrToolbar = (vditor: IVditor, type: TWYSISYGToolbar) => {
    if (vditor.options.customIrToolbar) {
        vditor.options.customIrToolbar(type, vditor.ir.popover);
    }
};

const setPopoverPosition = (vditor: IVditor, element: HTMLElement) => {
    let targetElement = element;
    const tableElement = hasClosestByMatchTag(element, "TABLE");
    if (tableElement) {
        targetElement = tableElement;
    }
    vditor.ir.popover.style.left = "0";
    vditor.ir.popover.style.display = "block";
    vditor.ir.popover.style.top =
        Math.max(-8, targetElement.offsetTop - 21 - vditor.ir.element.scrollTop) + "px";
    vditor.ir.popover.style.left =
        Math.min(targetElement.offsetLeft, vditor.ir.element.clientWidth - vditor.ir.popover.clientWidth) + "px";
    vditor.ir.popover.setAttribute("data-top", (targetElement.offsetTop - 21).toString());
};