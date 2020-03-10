import {
    previewTemplate, CODE_TYPE, DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, codeIndent
} from "storybook-addon-preview";
import {
    DRAG_START_TEMPLATE, DRAG_TEMPLATE, RESIZE_START_TEMPLATE,
    RESIZE_TEMPLATE, SCALE_START_TEMPLATE, SCALE_TEMPLATE,
    ROTATE_START_TEMPLATE, ROTATE_TEMPLATE, WARP_TEMPLATE, WARP_START_TEMPLATE,
} from "../events.template";
import { DRAGGABLE_PROPS, DRAGGABLE_FRAME } from "../ables/Draggable.template";
import { RESIZABLE_PROPS, RESIZABLE_FRAME } from "../ables/Resizable.template";
import { SCALABLE_PROPS, SCALABLE_FRAME } from "../ables/Scalable.template";
import { ROTATABLE_PROPS, ROTATABLE_FRAME } from "../ables/Rotatable.template";
import { WARPABLE_PROPS, WARPABLE_FRAME } from "../ables/Warpable.template";

export const BASIC_REACT_TEMPLATE = (
    ableName: string,
    props: any,
    frame: any,
    eventName: any,
    startTemplate: any,
    ingTemplate: any,
) => markup => previewTemplate`
import * as React from "react";
import Moveable from "react-moveable";

export default function App() {
    const [target, setTarget] = React.useState();
    const [frame] = React.useState({
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), { indent: 8 })}
    });
    React.useEffect(() => {
        setTarget(document.querySelector(".target")!);
    }, []);
    return <div className="container">${markup}
        <Moveable
            target={target}
            ${ableName}={true}
${JSX_PROPS_TEMPLATE(props, { indent: 12 })}
            on${eventName}Start={${codeIndent(startTemplate(CODE_TYPE.ARROW, "react"), { indent: 12 })}}
            on${eventName}={${codeIndent(ingTemplate(CODE_TYPE.ARROW), { indent: 12 })}}
        />
    </div>;
}
`;

export const BASIC_DRAGGABLE_REACT_TEMPLATE = BASIC_REACT_TEMPLATE(
    "draggable",
    DRAGGABLE_PROPS,
    DRAGGABLE_FRAME,
    "Drag",
    DRAG_START_TEMPLATE,
    DRAG_TEMPLATE,
);

export const BASIC_RESIZABLE_REACT_TEMPLATE = BASIC_REACT_TEMPLATE(
    "resizable",
    RESIZABLE_PROPS,
    RESIZABLE_FRAME,
    "Resize",
    RESIZE_START_TEMPLATE,
    RESIZE_TEMPLATE,
);

export const BASIC_SCALABLE_REACT_TEMPLATE = BASIC_REACT_TEMPLATE(
    "scalable",
    SCALABLE_PROPS,
    SCALABLE_FRAME,
    "Scale",
    SCALE_START_TEMPLATE,
    SCALE_TEMPLATE,
);

export const BASIC_ROTATABLE_REACT_TEMPLATE = BASIC_REACT_TEMPLATE(
    "rotatable",
    ROTATABLE_PROPS,
    ROTATABLE_FRAME,
    "Rotate",
    ROTATE_START_TEMPLATE,
    ROTATE_TEMPLATE,
);

export const BASIC_WARPABLE_REACT_TEMPLATE = BASIC_REACT_TEMPLATE(
    "warpable",
    WARPABLE_PROPS,
    WARPABLE_FRAME,
    "Warp",
    WARP_START_TEMPLATE,
    WARP_TEMPLATE,
);
