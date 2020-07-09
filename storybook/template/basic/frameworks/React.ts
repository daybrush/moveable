import {
    previewTemplate, CODE_TYPE, DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, codeIndent
} from "storybook-addon-preview";
import { camelize, IObject } from "@daybrush/utils";

export const BASIC_REACT_TEMPLATE = (markup: any, {
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
    const [target, setTarget] = React.useState();
    const [frame, setFrame] = React.useState({
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 8 })}
    });
    React.useEffect(() => {
        setTarget(document.querySelector(".target")!);
    }, []);
    return <div className="container">${markup}
        <Moveable
            target={target}
${JSX_PROPS_TEMPLATE(props, { indent: 12 })}
${Object.keys(events).map(name =>  `            ${camelize(`on ${name}`)}={${codeIndent(events[name](CODE_TYPE.ARROW, "react"), { indent: 12 })}}`).join("\n")}
        />
    </div>;
}
`;
