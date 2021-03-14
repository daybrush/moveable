import { previewTemplate } from "storybook-addon-preview";

export function makeLink(ableName: string, property: string) {
    return `<a href="https://daybrush.com/moveable/release/latest/doc/Moveable.${ableName}.html#${property}" target="_blank">See API</a>`;
}
export function makeArgType(param: {
    type: "array" | "text" | "radio" | "object" | "number" | "boolean";
    description?: string;
    defaultValue: any;
    category?: string;
    control?: Record<string, any>;
    table?: Record<string, any>;
}) {
    return {
        control: {
            type: param.type,
            ...(param.control || {})
        },
        table: {
            defaultValue: { summary: param.defaultValue },
            category: param.category,
            ...(param.table || {}),
        },
        description: param.description,
    };
}
export function makeArgs(argTypes: any) {
    return Object.keys(argTypes).reduce((prev, cur) => {
        prev[cur] = argTypes[cur].table.defaultValue.summary;

        return prev;
    }, {} as Record<string, any>);
}

export function convertPath(text: string) {
    return text.replace("../../src/react-moveable", "react-moveable");
}
export function convertTemplate(text: string) {
    const previewText = text.replace(/App\([^)]*\)/g, "App()");

    const regex = /props\.([a-zA-Z0-9_]+)/g;

    let result: RegExpExecArray | null;
    let index = 0;

    let strings: string[] = [];
    let values: string[] = [];

    while(result = regex.exec(previewText)) {
        const nextIndex = result.index;

        strings.push(previewText.slice(index, nextIndex));
        values.push(result[1]);
        index = nextIndex + result[0].length;
    }

    strings.push(previewText.slice(index));
    return [strings, values];
}
