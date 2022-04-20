import {
    previewTemplate, CODE_TYPE, DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, codeIndent
} from "storybook-addon-preview";
import { camelize, IObject } from "@daybrush/utils";

export const GROUP_REACT_TEMPLATE = (markup: any, {
    ableName,
    props,
    frame,
    events,
}: {
    ableName: string,
    props: any[],
    frame: any,
    events: IObject<any>,
}) => previewTemplate`
import * as React from "react";
import Moveable from "react-moveable";

export default function App() {
    const [targets, setTargets] = React.useState();
    const [frames, setFrames] = React.useState([{
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 8 })}
    }, {
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 8 })}
    }, {
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 8 })}
    }]);
    React.useEffect(() => {
        setTargets([].slice.call(document.querySelectorAll(".target")));
    }, []);
    return <div className="container">${markup}
        <Moveable
            target={targets}
${JSX_PROPS_TEMPLATE(props, { indent: 12 })}
${Object.keys(events).map(name =>  `            ${camelize(`on ${name}`)}={${codeIndent(events[name](CODE_TYPE.ARROW, "react"), { indent: 12 })}}`).join("\n")}
        />
    </div>;
}
`;
