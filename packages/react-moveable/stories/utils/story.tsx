/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import { convertReactTemplate, convertPath } from "../utils";
// import { DEFAULT_DRAGGABLE_CONTROLS, DEFAULT_CLIPPABLE_CONTROLS } from "../controls/default";


export interface StoryParameter {
    app: any;
    text: string;
}
export function makeStoryGroup(title: string, module: NodeModule) {
    const stories = storiesOf(title, module);

    function add(storyTitle: string, {
        app,
        text,
    }: StoryParameter) {
        stories.add(storyTitle, (props: any) => {
            const Component = app;

            return <Component {...props}/>;
        }, {
            // argTypes: {
            //     ...DEFAULT_DRAGGABLE_CONTROLS,
            //     ...DEFAULT_CLIPPABLE_CONTROLS,
            // },
            preview: {
                tab: "React",
                template: convertReactTemplate(convertPath(text)),
                codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable"]),
                language: "tsx",
            },
        });
    }
    return {
        add,
    };
}
