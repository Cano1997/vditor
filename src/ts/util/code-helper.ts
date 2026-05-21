export const handleCodeblock = (htmlString: string) => {
    const template = document.createElement("template");
    template.innerHTML = htmlString;
    const nodes = template.content.querySelectorAll('div[data-type="code-block"] pre.vditor-ir__preview');
    nodes.forEach(node => {
        const codeNode = node.querySelector('code');
        if (codeNode) {
            codeNode.innerHTML = '';
        }
    })
    return template.innerHTML;
}