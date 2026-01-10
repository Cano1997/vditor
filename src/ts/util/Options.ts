import {Constants} from "../constants";
import {merge} from "./merge";

export class Options {
    public options: IOptions;
    private defaultOptions: IOptions = {
        rtl: false,
        after: undefined,
        cache: {
            enable: true,
        },
        cdn: Constants.CDN,
        classes: {
            preview: "",
        },
        comment: {
            enable: false,
        },
        counter: {
            enable: false,
            type: "markdown",
        },
        customRenders: [],
        debugger: false,
        fullscreen: {
            index: 90,
        },
        height: "auto",
        hint: {
            delay: 200,
            emoji: {
                "+1": "👍",
                "-1": "👎",
                "confused": "😕",
                "eyes": "👀️",
                "heart": "❤️",
                "rocket": "🚀️",
                "smile": "😄",
                "tada": "🎉️",
            },
            emojiPath: `${Constants.CDN}/dist/images/emoji`,
            extend: [],
            parse: true,
        },
        icon: "ant",
        lang: "zh_CN",
        mode: "ir",
        outline: {
            enable: false,
            position: "left",
        },
        placeholder: "",
        preview: {
            actions: ["desktop", "tablet", "mobile", "mp-wechat", "zhihu"],
            delay: 1000,
            hljs: Constants.HLJS_OPTIONS,
            markdown: Constants.MARKDOWN_OPTIONS,
            math: Constants.MATH_OPTIONS,
            maxWidth: 800,
            mode: "both",
            theme: Constants.THEME_OPTIONS,
            render: {
                media: {
                    enable: true,
                }
            }
        },
        link: {
            isOpen: true,
        },
        image: {
            isPreview: true,
        },
        resize: {
            enable: false,
            position: "bottom",
        },
        theme: "classic",
        toolbar: [
            "emoji",
            "headings",
            "bold",
            "italic",
            "strike",
            "link",
            "|",
            "list",
            "ordered-list",
            "check",
            "outdent",
            "indent",
            "|",
            "quote",
            "line",
            "code",
            "inline-code",
            "insert-before",
            "insert-after",
            "|",
            "upload",
            "record",
            "table",
            "|",
            "undo",
            "redo",
            "|",
            "fullscreen",
            "edit-mode",
            {
                name: "more",
                toolbar: [
                    "both",
                    "code-theme",
                    "content-theme",
                    "export",
                    "outline",
                    "preview",
                    "devtools",
                    "info",
                    "help",
                ],
            },
        ],
        toolbarConfig: {
            hide: false,
            pin: false,
        },
        typewriterMode: false,
        undoDelay: 800,
        upload: {
            extraData: {},
            fieldName: "file[]",
            filename: (name: string) => name.replace(/\W/g, ""),
            linkToImgUrl: "",
            max: 10 * 1024 * 1024,
            multiple: true,
            url: "",
            withCredentials: false,
        },
        value: "",
        width: "auto",
    };

    constructor(options: IOptions) {
        this.options = options;
    }

    public merge(): IOptions {
        if (this.options) {
            if (this.options.toolbar) {
                this.options.toolbar = this.mergeToolbar(this.options.toolbar);
            } else {
                this.options.toolbar = this.mergeToolbar(this.defaultOptions.toolbar);
            }
            if (this.options.preview?.theme?.list) {
                this.defaultOptions.preview.theme.list = this.options.preview.theme.list;
            }
            if (this.options.preview?.render?.media?.enable) {
                this.defaultOptions.preview.render.media.enable = this.options.preview.render.media.enable;
            }
            if (this.options.hint?.emoji) {
                this.defaultOptions.hint.emoji = this.options.hint.emoji;
            }
            if (this.options.comment) {
                this.defaultOptions.comment = this.options.comment;
            }

            if (this.options.cdn) {
                if (!this.options.preview?.theme?.path) {
                    this.defaultOptions.preview.theme.path = `${this.options.cdn}/dist/css/content-theme`
                }
                if (!this.options.hint?.emojiPath) {
                    this.defaultOptions.hint.emojiPath = `${this.options.cdn}/dist/images/emoji`;
                }
            }
        }

        const mergedOptions = merge(this.defaultOptions, this.options);

        if (mergedOptions.cache.enable && !mergedOptions.cache.id) {
            throw new Error(
                "need options.cache.id, see https://ld246.com/article/1549638745630#options",
            );
        }

        return mergedOptions;
    }

    private mergeToolbar(toolbar: Array<string | IMenuItem>) {
        const toolbarItem = [
            {
                icon: '<svg><use xlink:href="#vditor-icon-export"></use></svg>',
                name: "export",
                tipPosition: "ne",
            },
            {
                hotkey: "⌘E",
                icon: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="axknormal/smile-plus" stroke-width="1" fill-rule="evenodd"><path d="M14.727 7h1.211A8 8 0 1111.206.668L10.795 1.8A6.8 6.8 0 1014.727 7zm-.226-1h1.247-1.247zM5 8a1 1 0 110-2 1 1 0 010 2zm6.97 1.5a4 4 0 01-7.94 0h1.215a2.8 2.8 0 005.51 0h1.214zM11 8a1 1 0 110-2 1 1 0 010 2zm2.264-5.177V1.459h1.2v1.364h1.364v1.2h-1.364v1.363h-1.2V4.023H11.9v-1.2h1.364z" id="axk形状结合"></path></g></svg>`,
                name: "emoji",
                tipPosition: "ne",
            },
            {
                hotkey: "⌘H",
                icon:
                    '<svg><use xlink:href="#vditor-icon-headings"></use></svg>',
                name: "headings",
                tipPosition: "ne",
            },
            {
                hotkey: "⌘B",
                icon: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="afbeditor/bold" stroke-width="1" fill-rule="evenodd"><path d="M10.788 6.717c1.796.246 3.143 1.936 3.143 4.05 0 2.285-1.7 4.214-3.713 4.214H3.116V7.823H2.8v-5.47h.325V1h5.479c1.666 0 3.02 1.53 3.02 3.412a3.63 3.63 0 01-.836 2.305zm-.57 7.065c1.34 0 2.514-1.41 2.514-3.015 0-1.616-1.054-2.881-2.399-2.881h-6.78v5.896h6.665zM8.604 6.623c.936 0 1.82-1.075 1.82-2.21 0-1.2-.833-2.213-1.82-2.213H3.553v4.423h5.05z" id="afb形状结合"></path><path d="M3.1 14.981c-.33 0-.6-.322-.6-.717V1.717c0-.395.27-.717.6-.717.33 0 .6.322.6.717v12.547c0 .395-.27.717-.6.717" id="afbFill-1"></path></g></svg>`,
                name: "bold",
                prefix: "**",
                suffix: "**",
                tipPosition: "ne",
            },
            {
                hotkey: "⌘I",
                icon: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="apceditor/italic" stroke-width="1" fill-rule="evenodd"><g id="apc文本编辑_倾斜-1.5px-16*16" transform="translate(2 1)"><path d="M3.646 12.8L6.754 1.2H3.5V0H11v1.2H7.996L4.888 12.8H8V14H.5v-1.2h3.146z" id="apc形状结合"></path></g></g></svg>`,
                name: "italic",
                prefix: "*",
                suffix: "*",
                tipPosition: "ne",
            },
            {
                hotkey: "⌘D",
                icon: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="ayleditor/strike" stroke-width="1" fill-rule="evenodd"><path d="M6 8.6H.894V7.4H3.5c-.62-.67-1-1.565-1-2.55v-.1A3.75 3.75 0 016.25 1h3.5a3.75 3.75 0 013.742 3.5h-1.204A2.55 2.55 0 009.75 2.2h-3.5A2.55 2.55 0 003.7 4.75v.1A2.55 2.55 0 006.25 7.4h8.85v1.2h-2.6a3.75 3.75 0 01-2.75 6.3h-3.5A3.75 3.75 0 012.503 11h1.201a2.55 2.55 0 002.546 2.7h3.5a2.55 2.55 0 000-5.1h-3.5a2.58 2.58 0 00-.25.012V8.6z" id="ayl形状结合"></path></g></svg>`,
                name: "strike",
                prefix: "~~",
                suffix: "~~",
                tipPosition: "ne",
            },
            {
                hotkey: "⌘K",
                icon: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="apveditor/link-insert" stroke-width="1" fill-rule="evenodd"><path d="M12.253 4.13h-1.2v-1a2.8 2.8 0 00-5.6 0v4a2.8 2.8 0 002.8 2.8v1.2a4 4 0 01-4-4v-4a4 4 0 018 0v1zm-8 8h1.2v1a2.8 2.8 0 005.6 0v-4a2.8 2.8 0 00-2.8-2.8v-1.2a4 4 0 014 4v4a4 4 0 01-8 0v-1z" id="apv形状结合" transform="rotate(46 8.253 8.13)"></path></g></svg>`,
                name: "link",
                prefix: "[",
                suffix: "](https://)",
                tipPosition: "n",
            },
            {
                name: "|",
            },
            {
                hotkey: "⌘L",
                icon: '<svg><use xlink:href="#vditor-icon-list"></use></svg>',
                name: "list",
                prefix: "* ",
                tipPosition: "n",
            },
            {
                hotkey: "⌘O",
                icon:
                    '<svg><use xlink:href="#vditor-icon-ordered-list"></use></svg>',
                name: "ordered-list",
                prefix: "1. ",
                tipPosition: "n",
            },
            {
                hotkey: "⌘J",
                icon: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="apyeditor/list-check" stroke-width="1" fill-rule="evenodd"><path d="M2 2.551L3.576.976l.848.848L2 4.25.576 2.824l.848-.848L2 2.55zm0 5.425L3.576 6.4l.848.849L2 9.673.576 8.249l.848-.849.576.576zm0 5.4L3.576 11.8l.848.849L2 15.073.576 13.649l.848-.849.576.576zM5.663 2.6a.6.6 0 110-1.2H15.4a.6.6 0 010 1.2H5.663zm0 11.8a.6.6 0 010-1.2H15.4a.6.6 0 010 1.2H5.663zm0-6.2a.6.6 0 110-1.2H15.4a.6.6 0 010 1.2H5.663z" id="apy合并形状"></path></g></svg>`,
                name: "check",
                prefix: "* [ ] ",
                tipPosition: "n",
            },
            {
                hotkey: "⇧⌘I",
                icon:
                    '<svg><use xlink:href="#vditor-icon-outdent"></use></svg>',
                name: "outdent",
                tipPosition: "n",
            },
            {
                hotkey: "⇧⌘O",
                icon: '<svg><use xlink:href="#vditor-icon-indent"></use></svg>',
                name: "indent",
                tipPosition: "n",
            },
            {
                name: "|",
            },
            {
                hotkey: "⌘;",
                icon: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="aezeditor/blockquote" stroke-width="1" fill-rule="evenodd"><path d="M9.499 13.753v-5.5H15v5.5H9.499zm1-4.5v3.5H14v-3.5h-3.501zm-9.5 4.5v-5.5H6.5v5.5H.999zm1-4.5v3.5H5.5v-3.5H1.999zM6.5 2.222v1.2c-.074-.004-.145-.022-.22-.022a4.12 4.12 0 00-4.115 4.115c0 .253.031.498.075.738H1C.965 8.01.966 7.768.966 7.515A5.32 5.32 0 016.28 2.2c.075 0 .145.019.22.022zm8.5 0v1.2c-.074-.004-.145-.022-.22-.022a4.12 4.12 0 00-4.115 4.115c0 .253.031.498.075.738H9.5c-.035-.243-.034-.485-.034-.738A5.32 5.32 0 0114.78 2.2c.075 0 .145.019.22.022z" id="aez形状结合"></path></g></svg>`,
                name: "quote",
                prefix: "> ",
                tipPosition: "n",
            },
            {
                hotkey: "⇧⌘H",
                icon: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="anueditor/horizontal-line" stroke-width="1" fill-rule="evenodd"><path id="anu矩形" d="M1.5 8h13v1h-13z"></path></g></svg>`,
                name: "line",
                prefix: "---",
                tipPosition: "n",
            },
            {
                hotkey: "⌘U",
                icon: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="ahqeditor/code" stroke-width="1" fill-rule="evenodd"><path d="M4.875 2.702L1.43 8.032l3.446 5.332-1.008.652L0 8.033l3.867-5.982 1.008.651zm6.25 10.662l3.446-5.33-3.446-5.332 1.008-.651L16 8.033l-3.867 5.983-1.008-.652zM8.852 1.402l1.172.257L7.21 14.53l-1.172-.256L8.852 1.402z" id="ahq形状结合"></path></g></svg>`,
                name: "code",
                prefix: "```",
                suffix: "\n```",
                tipPosition: "n",
            },
            {
                hotkey: "⌘G",
                icon:
                    '<svg><use xlink:href="#vditor-icon-inline-code"></use></svg>',
                name: "inline-code",
                prefix: "`",
                suffix: "`",
                tipPosition: "n",
            },
            {
                hotkey: "⇧⌘B",
                icon: '<svg><use xlink:href="#vditor-icon-before"></use></svg>',
                name: "insert-before",
                tipPosition: "n",
            },
            {
                hotkey: "⇧⌘E",
                icon: '<svg><use xlink:href="#vditor-icon-after"></use></svg>',
                name: "insert-after",
                tipPosition: "n",
            },
            {
                name: "|",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-upload"></use></svg>',
                name: "upload",
                tipPosition: "n",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-record"></use></svg>',
                name: "record",
                tipPosition: "n",
            },
            {
                hotkey: "⌘M",
                icon: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="ayxeditor/table-border-all" stroke-width="1" fill-rule="evenodd"><path d="M2.2 7.4h5.2V2.2H2.2v5.2zm0 1.2v5.2h5.2V8.6H2.2zm11.6-1.2V2.2H8.6v5.2h5.2zm0 1.2H8.6v5.2h5.2V8.6zM2 1h12a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z" id="ayx形状结合"></path></g></svg>`,
                name: "table",
                prefix: "| col1",
                suffix:
                    " | col2 | col3 |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |",
                tipPosition: "n",
            },
            {
                name: "|",
            },
            {
                hotkey: "⌘Z",
                icon: '<svg><use xlink:href="#vditor-icon-undo"></use></svg>',
                name: "undo",
                tipPosition: "nw",
            },
            {
                hotkey: "⌘Y",
                icon: '<svg><use xlink:href="#vditor-icon-redo"></use></svg>',
                name: "redo",
                tipPosition: "nw",
            },
            {
                name: "|",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-more"></use></svg>',
                name: "more",
                tipPosition: "e",
            },
            {
                hotkey: "⌘'",
                icon:
                    '<svg><use xlink:href="#vditor-icon-fullscreen"></use></svg>',
                name: "fullscreen",
                tipPosition: "nw",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-edit"></use></svg>',
                name: "edit-mode",
                tipPosition: "nw",
            },
            {
                hotkey: "⌘P",
                icon: '<svg><use xlink:href="#vditor-icon-both"></use></svg>',
                name: "both",
                tipPosition: "nw",
            },
            {
                icon:
                    '<svg><use xlink:href="#vditor-icon-preview"></use></svg>',
                name: "preview",
                tipPosition: "nw",
            },
            {
                icon:
                    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="bbjnavigation/toc" stroke-width="1" fill-rule="evenodd"><path d="M3.7 1a.6.6 0 110 1.2L3 2.199V2.2H1.2l-.001 5.199L6.4 7.4a.6.6 0 110 1.2l-5.201-.001L1.2 13.8h5.2a.6.6 0 010 1.2H1a1 1 0 01-1-1V2a1 1 0 011-1h2.7zm11.7 12.8a.6.6 0 010 1.2H9.3a.6.6 0 010-1.2h6.1zm0-6.4a.6.6 0 010 1.2H9.3a.6.6 0 110-1.2h6.1zm0-6.4a.6.6 0 010 1.2H6.6a.6.6 0 110-1.2h8.8z" id="bbj形状结合"></path></g></svg>',
                name: "outline",
                tipPosition: "nw",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-theme"></use></svg>',
                name: "content-theme",
                tipPosition: "nw",
            },
            {
                icon:
                    '<svg><use xlink:href="#vditor-icon-code-theme"></use></svg>',
                name: "code-theme",
                tipPosition: "nw",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-bug"></use></svg>',
                name: "devtools",
                tipPosition: "nw",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-info"></use></svg>',
                name: "info",
                tipPosition: "nw",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-help"></use></svg>',
                name: "help",
                tipPosition: "nw",
            },
            {
                name: "br",
            },
        ];
        const toolbarResult: IMenuItem[] = [];
        toolbar.forEach((menuItem: IMenuItem) => {
            let currentMenuItem = menuItem;
            toolbarItem.forEach((defaultMenuItem: IMenuItem) => {
                if (
                    typeof menuItem === "string" &&
                    defaultMenuItem.name === menuItem
                ) {
                    currentMenuItem = defaultMenuItem;
                }
                if (
                    typeof menuItem === "object" &&
                    defaultMenuItem.name === menuItem.name
                ) {
                    currentMenuItem = Object.assign({}, defaultMenuItem, menuItem);
                }
            });
            if (menuItem.toolbar) {
                currentMenuItem.toolbar = this.mergeToolbar(menuItem.toolbar);
            }
            toolbarResult.push(currentMenuItem);
        });
        return toolbarResult;
    }
}
