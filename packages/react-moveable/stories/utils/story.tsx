/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
import * as React from "react";
import { ReactFramework, StoryContext } from "@storybook/react";
import { ClientApi } from "@storybook/client-api";

import { convertReactTemplate, convertPath, makeArgs, convertTemplate } from "../utils";
import { DEFAULT_CSS_TEMPLATE } from "../templates/default";
import { getEntries, isFunction } from "@daybrush/utils";

declare const SKIP_TEST: boolean;

export interface StoryParameter {
    app: any;
    text?: string;
    path?: string;
    argsTypes?: Record<string, any>;
    texts?: Record<string, any>;
    play?: (context: StoryContext<ReactFramework>) => Promise<void> | void;
}

function makeProxyObject(
    defaultValue: Record<string, any> = {},
    setter?: (obj: Record<string, any>, prop: string, value: any) => any,
): Record<string, any> {
    const proxy = new Proxy({} as Record<string, any>, {
        set(obj, prop, value) {
            if (!setter?.(obj, prop as string, value)) {
                obj[prop as string] = value;
            }
            return true;
        },
    });

    getEntries(defaultValue).forEach(([key, value]) => {
        proxy[key] = value;
    });
    return proxy;
}

export function add(storyTitle: string, parameter: StoryParameter) {
    const {
        text,
        argsTypes,
        path,
        play,
        app,
    } = parameter;
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
        // Angular
        try {
            const angularCode = require(`!!raw-loader!@/stories/${directory}angular/${fileName}/App.component.ts`).default;

            previews.push({
                tab: "Angular",
                template: convertTemplate(angularCode, /"\$preview_([^"]+)"/g),
                copy: true,
                language: "tsx",
            });
        } catch (e) {}
    } else if (text) {
        previews.unshift({
            tab: "React",
            template: convertReactTemplate(convertPath(text)),
            // codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
            copy: true,
            language: "tsx",
        });
    }

    const func = function (this: any, props: any) {
        const Component = app;

        return <Component {...props} />;
    };

    func.storyName = storyTitle;
    func.argTypes = argsTypes || {},
    func.args = makeArgs(argsTypes || {}),
    func.parameters = {
        preview: previews,
    };



    if (!SKIP_TEST && play) {
        func.play = play;

        const clientApi = (window as any).__STORYBOOK_CLIENT_API__ as ClientApi<any>;
        const facade = clientApi.facade;
        const csfExports = facade.csfExports;
        const allStories = facade.stories;

        type StoryFunction = ((...args: any[]) => any) & {
            storyName: string;
            play: any;
            args: any;
            argTypes: any;
            parameters: any;
            isSkip?: boolean;
        };

        if (!("__PROXY__" in csfExports)) {
            facade.csfExports = makeProxyObject({
                __PROXY__: () => {},
                ...csfExports,
            }, (obj, prop, value) => {
                obj[prop] = makeProxyObject(value, (child, childProp, childValue: StoryFunction) => {
                    if (!isFunction(childValue) || !childValue.play || childValue.isSkip) {
                        return;
                    }

                    const copied = childValue.bind({}) as StoryFunction;

                    copied.storyName = `${childValue.storyName} (original)`;
                    copied.argTypes = childValue.argTypes;
                    copied.args = childValue.args;
                    copied.parameters = childValue.parameters;
                    // copied.play = childValue.play;
                    copied.isSkip = true;

                    child[`${childProp}Original`] = copied;

                    // childValue.play = null;
                    childValue.isSkip = true;
                    childValue.storyName = `${childValue.storyName} (test)`;
                });

                return true;
            });
            facade.stories = makeProxyObject(allStories, (obj, prop, value) => {
                if (value.name?.includes(" (test)")) {
                    const id = `${prop}-original`;
                    obj[`${prop}-original`] = {
                        ...value,
                        id,
                        name: value.name.replace(" (original)", " (test)"),
                    };
                }
            });
        }
    }

    return func;
}
