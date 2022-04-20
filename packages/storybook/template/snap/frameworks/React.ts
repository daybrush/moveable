import {
    previewTemplate, CODE_TYPE, DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, codeIndent
} from "storybook-addon-preview";
import { camelize, IObject } from "@daybrush/utils";

export const SNAP_REACT_TEMPLATE = (markup: any, {
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
    const [elementGuidelines, setElementGuidelines] = React.useState([]);
    const [frame, setFrame] = React.useState({
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 8 })}
    });
    React.useEffect(() => {
        setTarget(document.querySelector(".target")!);
        setElementGuidelines([
            document.querySelector(".nested.rotate"),
            document.querySelector(".nested.scale"),
            document.querySelector(".nested.first"),
        ]);
    }, []);
    return <div className="container">${markup}
        <Moveable
            target={target}
            elementGuidelines={elementGuidelines}
${JSX_PROPS_TEMPLATE(props, { indent: 12 })}
${Object.keys(events).map(name =>  `            ${camelize(`on ${name}`)}={${codeIndent(events[name](CODE_TYPE.ARROW, "react"), { indent: 12 })}}`).join("\n")}
        />
    </div>;
}
`;
