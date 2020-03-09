import {
    previewTemplate, CODE_TYPE, DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, codeIndent, ANGULAR_PROPS_TEMPLATE
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
import { camelize } from "@daybrush/utils";

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
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), 8)}
    });
    React.useEffect(() => {
        setTarget(document.querySelector(".target")!);
    }, []);
    return <div className="container">${markup}
        <Moveable
            target={target}
            ${ableName}={true}
${JSX_PROPS_TEMPLATE(props, 12)}
            on${eventName}Start={${codeIndent(startTemplate(CODE_TYPE.ARROW, "react"), { indent: 12 })}}
            on${eventName}={${codeIndent(ingTemplate(CODE_TYPE.ARROW), { indent: 12 })}}
        />
    </div>;
}
`;

export const BASIC_ANGULAR_HTML_TEMPLATE = (
    ableName: string,
    props: any,
    eventName: string,
) => markup => previewTemplate`
${markup}
<ngx-moveable
    [target]="target"
    [${ableName}]="true"
${ANGULAR_PROPS_TEMPLATE(props, 4)}
    (${eventName}Start)="${camelize(`on ${eventName}`)}Start($event)"
    (${eventName})="onDrag($event)"
    ></ngx-moveable>
`;
export const BASIC_ANGULAR_COMPONENT_TEMPLATE = (
    frame: any,
    startTemplate: any,
    ingTemplate: any,
) => previewTemplate`
import { Component } from "@angular/core";

@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    frame = {
${DEFAULT_PROPS_TEMPLATE(Object.keys(frame), 8)}
    };
    ${codeIndent(startTemplate(CODE_TYPE.METHOD, "angular"), { indent: 4 })}
    ${codeIndent(ingTemplate(CODE_TYPE.METHOD), { indent: 4 })}
}
`;
export const BASIC_DRAGGABLE_ANGULAR_HTML_TEMPLATE = BASIC_ANGULAR_HTML_TEMPLATE(
    "draggable", DRAGGABLE_PROPS, "drag");
export const BASIC_DRAGGABLE_ANGULAR_COMPONENT_TEMPLATE = BASIC_ANGULAR_COMPONENT_TEMPLATE(
    DRAGGABLE_FRAME, DRAG_START_TEMPLATE, DRAG_TEMPLATE);

export const BASIC_RESIZABLE_ANGULAR_HTML_TEMPLATE = BASIC_ANGULAR_HTML_TEMPLATE(
    "resizable", RESIZABLE_PROPS, "resize");
export const BASIC_RESIZABLE_ANGULAR_COMPONENT_TEMPLATE = BASIC_ANGULAR_COMPONENT_TEMPLATE(
    RESIZABLE_FRAME, RESIZE_START_TEMPLATE, RESIZE_TEMPLATE);

export const BASIC_SCALABLE_ANGULAR_HTML_TEMPLATE = BASIC_ANGULAR_HTML_TEMPLATE(
    "scalable", SCALABLE_PROPS, "scale");
export const BASIC_SCALABLE_ANGULAR_COMPONENT_TEMPLATE = BASIC_ANGULAR_COMPONENT_TEMPLATE(
    SCALABLE_FRAME, SCALE_START_TEMPLATE, SCALE_TEMPLATE);

export const BASIC_ROTATABLE_ANGULAR_HTML_TEMPLATE = BASIC_ANGULAR_HTML_TEMPLATE(
    "rotatable", ROTATABLE_PROPS, "rotate");
export const BASIC_ROTATABLE_ANGULAR_COMPONENT_TEMPLATE = BASIC_ANGULAR_COMPONENT_TEMPLATE(
    ROTATABLE_FRAME, ROTATE_START_TEMPLATE, ROTATE_TEMPLATE);

export const BASIC_WARPABLE_ANGULAR_HTML_TEMPLATE = BASIC_ANGULAR_HTML_TEMPLATE(
    "warpable", WARPABLE_PROPS, "warp");
export const BASIC_WARPABLE_ANGULAR_COMPONENT_TEMPLATE = BASIC_ANGULAR_COMPONENT_TEMPLATE(
    WARPABLE_FRAME, WARP_START_TEMPLATE, WARP_TEMPLATE);
