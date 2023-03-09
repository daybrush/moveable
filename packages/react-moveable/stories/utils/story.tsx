/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { convertReactTemplate, convertPath, makeArgs, convertTemplate } from "../utils";
import { DEFAULT_CSS_TEMPLATE } from "../templates/default";
// import { DEFAULT_DRAGGABLE_CONTROLS, DEFAULT_CLIPPABLE_CONTROLS } from "../controls/default";


export interface StoryParameter {
    app: any;
    text?: string;
    path?: string;
    argsTypes?: Record<string, any>;
    texts?: Record<string, any>;
}
export function makeStoryGroup(title: string, module: NodeModule) {
    const stories = storiesOf(title, module);

    function add(storyTitle: string, {
        app,
        text,
        argsTypes,
        path,
    }: StoryParameter) {
        const previews: any[] = [
            {
                tab: "CSS",
                template: DEFAULT_CSS_TEMPLATE,
                copy: true,
                language: "css",
            },
        ];

        if (path) {
            const filePath = path.replace("./stories/", "");
            const directory = filePath.replace(/\/([^/]+)$/g, "/");
            const fileName = filePath.replace(/\S+\/(\S+)\.\S+$/g, "$1");
            const reactCode = require(`!!raw-loader!@/stories/${filePath}`).default;

            previews.unshift({
                tab: "React",
                template: convertReactTemplate(convertPath(reactCode)),
                copy: true,
                // codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
                language: "tsx",
            });
            // HTML
            try {
                const htmlCode = require(`!!raw-loader!@/stories/${directory}script/${fileName}/App.html`).default;

                previews.push({
                    tab: "Script",
                    description: "HTML",
                    template: htmlCode,
                    copy: true,
                    language: "html",
                });
            } catch (e) {
            }
            // Script
            try {
                const scriptCode = require(`!!raw-loader!@/stories/${directory}script/${fileName}/App.js`).default;

                previews.push({
                    tab: "Script",
                    description: "JavaScript",
                    template: convertTemplate(scriptCode, /"\$preview_([^"]+)"/g),
                    copy: true,
                    language: "tsx",
                });
            } catch (e) {
            }
            // Vue3
            try {
                const vueCode = require(`!!raw-loader!@/stories/${directory}vue3/${fileName}/App.vue`).default;

                previews.push({
                    tab: "Vue3",
                    template: convertTemplate(vueCode, /"\$preview_([^"]+)"/g),
                    copy: true,
                    language: "html",
                });
            } catch (e) {
            }
            // Vue2
            try {
                const vueCode = require(`!!raw-loader!@/stories/${directory}vue2/${fileName}/App.vue`).default;

                previews.push({
                    tab: "Vue2",
                    template: convertTemplate(vueCode, /"\$preview_([^"]+)"/g),
                    copy: true,
                    language: "html",
                });
            } catch (e) { }
            // Svelte
            try {
                const svelteCode = require(`!!raw-loader!@/stories/${directory}svelte/${fileName}/App.svelte`).default;

                previews.push({
                    tab: "Svelte",
                    template: convertTemplate(svelteCode, /"\$preview_([^"]+)"/g),
                    copy: true,
                    language: "html",
                });
            } catch (e) { }
        } else if (text) {
            previews.unshift({
                tab: "React",
                template: convertReactTemplate(convertPath(text)),
                // codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
                copy: true,
                language: "tsx",
            });
        }

        stories.add(storyTitle, (props: any) => {
            const Component = app;

            return <Component {...props} />;
        }, {
            argTypes: argsTypes || {},
            args: makeArgs(argsTypes || {}),
            preview: previews,
        });
    }
    return {
        add,
    };
}
