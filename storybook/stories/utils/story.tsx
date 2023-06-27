/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
import * as React from "react";
import { StoryContext } from "@storybook/react";
import { ClientApi } from "@storybook/client-api";

import { convertReactTemplate, convertPath, makeArgs, convertTemplate } from "../utils";
import { DEFAULT_CSS_TEMPLATE } from "../templates/default";
import { getEntries, isFunction } from "@daybrush/utils";
import { angularWrapper, scriptWrapper, svelteWrapper, vueWrapper } from "./wrapper";

// // production 모드거나, 실패시 true
// declare const SKIP_TEST: boolean;
// // test 여부
declare const STORY_CODES: Record<string, {
    code: string;
    appName: string;
    fileName: string;
    framework: string;
    relativePath: string;
}>;

const EXEC_TEST = false;
const SKIP_TEST = false;

export interface StoryParameter {
    app: any;
    appName?: string;
    relativePath?: string;
    argsTypes?: Record<string, any>;
    args?: Record<string, any>;
    play?: (context: StoryContext) => Promise<void> | void;
}
export type StroyFunc = {
    (this: any, props: any): React.JSX.Element;
    storyName?: string;
    argTypes?: Record<string, any>;
    play?: (context: StoryContext) => Promise<void> | void;
    args?: Record<string, any>;
    parameters?: Record<string, any>;
    isSkip?: boolean;
    appName?: string;
    relativePath?: string;
};

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

export function makeGroup(
    relativePath: string,
) {
    return {
        add(storyTitle: string, parameter: StoryParameter) {
            return add(storyTitle, {
                relativePath,
                ...parameter,
            })
        },
    };
}

export function add(storyTitle: string, parameter: StoryParameter): StroyFunc {
    const {
        relativePath,
        argsTypes,
        args,
        play,
        app,
        appName,
    } = parameter;
    const previews: any[] = [
        {
            tab: "CSS",
            template: DEFAULT_CSS_TEMPLATE,
            copy: true,
            language: "css",
        },
    ];

    // test라면 play가 없는 스토리는 전부 빈공백으로 표시
    if (EXEC_TEST && !play) {
        return function Empty() {
            return null;
        } as any;
    }

    // test가 아니라면 code preview 표시
    if (!EXEC_TEST) {
        try {
            const codeInfo = STORY_CODES[`${relativePath}-react-${appName}-${appName}.tsx`];

            previews.unshift({
                tab: "React",
                template: convertReactTemplate(convertPath(codeInfo.code)),
                copy: true,
                // codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
                language: "tsx",
            });
        } catch (e) {
            console.log(e);
        }
        try {
            const codeInfo = STORY_CODES[`${relativePath}-script-${appName}-App.html`];
            const htmlCode = codeInfo.code;

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
            const codeInfo = STORY_CODES[`${relativePath}-script-${appName}-App.js`];
            const scriptCode = codeInfo.code;

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
            const codeInfo = STORY_CODES[`${relativePath}-vue3-${appName}-App.vue`];
            const vueCode = codeInfo.code;

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
            const codeInfo = STORY_CODES[`${relativePath}-vue2-${appName}-App.vue`];
            const vueCode = codeInfo.code;

            previews.push({
                tab: "Vue2",
                template: convertTemplate(vueCode, /"\$preview_([^"]+)"/g),
                copy: true,
                language: "html",
            });
        } catch (e) { }
        // Svelte
        try {
            const codeInfo = STORY_CODES[`${relativePath}-svelte-${appName}-App.svelte`];
            const svelteCode = codeInfo.code;

            previews.push({
                tab: "Svelte",
                template: convertTemplate(svelteCode, /"\$preview_([^"]+)"/g),
                copy: true,
                language: "html",
            });
        } catch (e) { }
        // Angular html
        try {
            const codeInfo = STORY_CODES[`${relativePath}-angular-${appName}-App.component.html`];
            const angularCode = codeInfo.code;

            previews.push({
                tab: "Angular",
                template: angularCode,
                description: "App.comoponent.html",
                copy: true,
                language: "tsx",
            });
        } catch (e) { }
        // Angular
        try {
            const codeInfo = STORY_CODES[`${relativePath}-angular-${appName}-App.ts`];
            const angularCode = codeInfo.code;

            previews.push({
                tab: "Angular",
                template: convertTemplate(angularCode, /"\$preview_([^"]+)"/g),
                description: "App.comoponent.ts",
                copy: true,
                language: "tsx",
            });
        } catch (e) { }
        // Lit
        try {
            const codeInfo = STORY_CODES[`${relativePath}-lit-${appName}-App.ts`];
            const litCode = codeInfo.code;


            previews.push({
                tab: "Lit",
                template: convertTemplate(litCode, /"\$preview_([^"]+)"/g),
                copy: true,
                language: "tsx",
            });
        } catch (e) { }
    }
    const func: StroyFunc = function (this: any, props: any) {
        const Component = app;

        return <Component {...props} />;
    };

    func.relativePath = relativePath;
    func.appName = appName;
    func.storyName = storyTitle;
    func.argTypes = argsTypes || {};
    func.args = {
        ...makeArgs(argsTypes || {}),
    };
    func.parameters = {
        preview: previews,
    };

    // dev에서만 표시
    if (play) {
        const clientApi = (window as any).__STORYBOOK_CLIENT_API__ as ClientApi<any>;
        const facade = clientApi.facade;
        const csfExports = facade.csfExports;
        const allStories = facade.stories;

        if (!SKIP_TEST) {
            // dev mode or test mode
            (func as any).play = play;

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
                    __PROXY__: () => { },
                    ...csfExports,
                }, (obj, prop, value) => {
                    obj[prop] = makeProxyObject(value, (child, childProp, childValue: StoryFunction) => {
                        if (!isFunction(childValue) || !childValue.play || childValue.isSkip) {
                            return;
                        }
                        if (childValue.storyName.match(/Test$/g)) {
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
        } else if (!EXEC_TEST) {
            // production mode
            if (!("__PROXY__" in csfExports)) {
                facade.csfExports = makeProxyObject({
                    __PROXY__: () => { },
                    ...csfExports,
                });
                facade.stories = makeProxyObject(allStories, (obj, prop, value) => {
                    if (value.name?.match(/Test$/g)) {
                        return true;
                    }
                });
            }
        }
    }

    return func;
}

export const convertFrameworkStory = (framework: string, app: StroyFunc, frameworkApp: (...args: any[]) => any): StroyFunc => {
    if (!app.appName) {
        return function () {} as any;
    }

    let nextFunc!: StroyFunc;

    if (framework === "vue3") {
        nextFunc = vueWrapper(frameworkApp);
    } else if (framework === "svelte") {
        nextFunc = svelteWrapper(frameworkApp);
    } else if (framework === "angular") {
        nextFunc = angularWrapper(frameworkApp);
    } else if (framework === "script") {
        const relativePath = app.relativePath;
        const appName = app.appName;
        const codeInfo = STORY_CODES[`${relativePath}-script-${appName}-App.html`];

        nextFunc = scriptWrapper(frameworkApp, codeInfo?.code);
    } else {
        return function() {} as any;
    }
    nextFunc.appName = app.appName;
    nextFunc.relativePath = app.relativePath;
    nextFunc.argTypes = app.argTypes;
    nextFunc.args = app.args;
    nextFunc.parameters = app.parameters;
    nextFunc.play = app.play;

    return nextFunc;
}
