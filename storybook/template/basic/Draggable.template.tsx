import * as React from "react";
import Moveable from "react-moveable";
import {
    previewTemplate, CODE_TYPE, codeIndent,
    DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, ANGULAR_PROPS_TEMPLATE,
} from "storybook-addon-preview";
import { DRAG_START_TEMPLATE, DRAG_TEMPLATE } from "./events.template";
import { BASIC_CSS_TEMPLATE } from "./template";

export default function App(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        translate: [0, 0],
    });
    React.useEffect(() => {
        setTarget(document.querySelector<HTMLElement>(".target")!);
    }, []);

    const {
        rootChildren = d => d,
        children = <div className="target">Target</div>,
        ...moveableProps
    } = props;
    return rootChildren(<div className="container">
        {children}
        <Moveable
            target={target}
            draggable={true}
            {...moveableProps}
            onDragStart={e => {
                e.set(frame.translate);
            }}
            onDrag={e => {
                frame.translate = e.beforeTranslate;
                e.target.style.transform
                    = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;
            }}
        />
    </div>);
}

const DRAGGABLE_PROPS = ["throttleDrag", "throttleDragRotate", "zoom", "origin"];

export const BASIC_DRAGGABLE_VANILLA_TEMPLATE = previewTemplate`
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: document.querySelector(".target"),
    draggable: true,
${DEFAULT_PROPS_TEMPLATE(DRAGGABLE_PROPS)}
});

const frame = {
    translate: [0, 0],
};
moveable.on("dragStart", ${DRAG_START_TEMPLATE(CODE_TYPE.ARROW)}).on("drag", ${DRAG_TEMPLATE(CODE_TYPE.ARROW)});
`;

export const BASIC_DRAGGABLE_REACT_TEMPLATE = previewTemplate`
import * as React from "react";
import Moveable from "react-moveable";

export default function App() {
    const [target, setTarget] = React.useState();
    const [frame] = React.useState({
        translate: [0, 0],
    });
    React.useEffect(() => {
        setTarget(document.querySelector(".target")!);
    }, []);
    return <div className="container">
        <div className="target">Target</div>
        <Moveable
            target={target}
            draggable={true}
${JSX_PROPS_TEMPLATE(DRAGGABLE_PROPS, 12)}
            onDragStart={${codeIndent(DRAG_START_TEMPLATE(CODE_TYPE.ARROW, "react"), { indent: 12 })}}
            onDrag={${codeIndent(DRAG_TEMPLATE(CODE_TYPE.ARROW), { indent: 12 })}}
        />
    </div>;
}
`;

export const BASIC_DRAGGABLE_ANGULAR_HTML_TEMPLATE = previewTemplate`
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [draggable]="true"
${ANGULAR_PROPS_TEMPLATE(DRAGGABLE_PROPS, 4)}
    (dragStart)="onDragStart($event)"
    (drag)="onDrag($event)"
    ></ngx-moveable>
`;

export const BASIC_DRAGGABLE_ANGULAR_COMPONENT_TEMPLATE = previewTemplate`
import { Component } from "@angular/core";

@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    frame = {
        translate: [0, 0],
    };
    ${codeIndent(DRAG_START_TEMPLATE(CODE_TYPE.METHOD, "angular"), { indent: 4 })}
    ${codeIndent(DRAG_TEMPLATE(CODE_TYPE.METHOD), { indent: 4 })}
}
`;

export const BASIC_DRAGGABLE_SVELTE_TEMPLATE = `
<script>
    import Moveable from "svelte-moveable";

    const frame = {
        translate: [0, 0],
    };
    let target;
</script>
<style>
${BASIC_CSS_TEMPLATE}
</style>
`;

export const BASIC_DRAGGABLE_SVELTE_JSX_TEMPLATE = previewTemplate`
<div class="target" bind:this={target}>Target</div>
<Moveable
    draggable={true}
    target={target}
${JSX_PROPS_TEMPLATE(DRAGGABLE_PROPS, 4)}
    on:dragStart={${codeIndent(DRAG_START_TEMPLATE(CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}
    on:drag={${codeIndent(DRAG_TEMPLATE(CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}
/>
`;
