import {processHeading} from "../ir/process";
import {processHeading as processHeadingSV} from "../sv/process";
import {getEventName} from "../util/compatibility";
import {afterRenderEvent} from "../wysiwyg/afterRenderEvent";
import {removeHeading, setHeading} from "../wysiwyg/setHeading";
import {MenuItem} from "./MenuItem";

export class HeadingList extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.innerHTML = `
        <button class="header-item">正文</button>
        <button class="header-item" data-tag="h1" data-value="# ">标题1</button>
        <button class="header-item" data-tag="h2" data-value="## ">标题2</button>
        <button class="header-item" data-tag="h3" data-value="### ">标题3</button>
        <button class="header-item" data-tag="h4" data-value="#### ">标题4</button>`;



        this._bindEvent(vditor, this.element);
    }

    public _bindEvent(vditor: IVditor, panelElement: HTMLElement) {
        const actionBtn = this.element.children[0] as HTMLElement;
        actionBtn.addEventListener(getEventName(), (event) => {
            event.preventDefault();
            // https://github.com/Vanessa219/vditor/issues/1391
            clearTimeout(vditor.wysiwyg.afterRenderTimeoutId);
            clearTimeout(vditor.ir.processTimeoutId);
            clearTimeout(vditor.sv.processTimeoutId);
            if (vditor.currentMode === "wysiwyg") {
                removeHeading(vditor);
                afterRenderEvent(vditor);
            } else if (vditor.currentMode === "ir") {
                processHeading(vditor, "");
            }
        });

        for (let i = 1; i < 5; i++) {
            panelElement.children.item(i).addEventListener(getEventName(), (event: Event) => {
                event.preventDefault();
                if (vditor.currentMode === "wysiwyg") {
                    setHeading(vditor, (event.target as HTMLElement).getAttribute("data-tag"));
                    afterRenderEvent(vditor);
                } else if (vditor.currentMode === "ir") {
                    processHeading(vditor, (event.target as HTMLElement).getAttribute("data-value"));
                } else {
                    processHeadingSV(vditor, (event.target as HTMLElement).getAttribute("data-value"));
                }
            });
        }
    }
}
