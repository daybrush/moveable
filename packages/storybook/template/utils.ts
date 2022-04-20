import { VANILLA_CODESANDBOX, REACT_CODESANDBOX, ANGULAR_CODESANDBOX, SVELTE_CODESANDBOX } from "./codesandbox";

import { DEFAULT_ANGULAR_MODULE_TEMPLATE } from "./default";

export function removeDuplicate(arr: string[]) {
    const arrMap = {};

    return arr.filter(v => {
        if (arrMap[v]) {
            return false;
        }

        arrMap[v] = true;
        return true;
    });
}
export function previewCollection(
    htmlTemplate,
    cssTemplate,
    vanillaTemplate,
    reactTemplate,
    angularHTMLTemplate,
    angularComponentTemplate,
    svelteTemplate,
    svelteJSXTemplate,
    knobs?: any,
) {
    return [
        {
            tab: "HTML",
            template: htmlTemplate,
            language: "html",
        },
        {
            tab: "CSS",
            template: cssTemplate,
            language: "css",
        },
        {
            tab: "Vanilla",
            template: vanillaTemplate,
            codesandbox: VANILLA_CODESANDBOX,
            knobs,
        },
        {
            tab: "React",
            template: reactTemplate,
            language: "tsx",
            codesandbox: REACT_CODESANDBOX,
        },
        {
            tab: "Angular",
            description: "app.component.html",
            template: angularHTMLTemplate,
            language: "markup",
            codesandbox: ANGULAR_CODESANDBOX,
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: angularComponentTemplate,
            language: "typescript",
            codesandbox: ANGULAR_CODESANDBOX,
        },
        {
            tab: "Angular",
            description: "app.module.ts",
            template: DEFAULT_ANGULAR_MODULE_TEMPLATE,
            language: "typescript",
            codesandbox: ANGULAR_CODESANDBOX,
        },
        {
            tab: "Svelte",
            template: svelteTemplate(cssTemplate),
            language: "html",
            continue: true,
            codesandbox: SVELTE_CODESANDBOX,
        },
        {
            tab: "Svelte",
            template: svelteJSXTemplate,
            language: "tsx",
            continue: true,
            codesandbox: SVELTE_CODESANDBOX,
        },
    ];
}
