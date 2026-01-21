import {getMarkdown} from "./getMarkdown";

export const getHTML = (vditor: IVditor) => {
    if (vditor.currentMode === "sv") {
        const markdownText = getMarkdown(vditor);
        const innnerHTML = vditor.lute.Md2VditorIRDOM(markdownText);
        return vditor.lute.VditorIRDOM2HTML(innnerHTML);
    } else if (vditor.currentMode === "wysiwyg") {
        const markdownText = getMarkdown(vditor);
        const innnerHTML = vditor.lute.Md2VditorIRDOM(markdownText);
        return vditor.lute.VditorIRDOM2HTML(innnerHTML);
    } else if (vditor.currentMode === "ir") {
        return vditor.lute.VditorIRDOM2HTML(vditor.ir.element.innerHTML);
    }
};
