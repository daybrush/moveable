import * as React from "react";
import Moveable from "react-moveable";
import {
    CODE_TYPE, codeIndent, previewTemplate,
    DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, ANGULAR_PROPS_TEMPLATE,
} from "storybook-addon-preview";
import { RESIZE_START_TEMPLATE, RESIZE_TEMPLATE } from "./events.template";
import { BASIC_CSS_TEMPLATE } from "./template";

export default function ResizableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        width: 100,
        height: 100,
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
            resizable={true}
            {...moveableProps}
            onResizeStart={e => {
                e.set([frame.width, frame.height]);
                e.setOrigin(["%", "%"]);
                e.dragStart && e.dragStart.set(frame.translate);
            }}
            onResize={e => {
                frame.width = e.width;
                frame.height = e.height;
                frame.translate = e.drag.beforeTranslate;

                e.target.style.cssText
                    = `transform: translate(${frame.translate[0]}px, ${frame.translate[1]}px);`
                    + `width: ${e.width}px; height: ${e.height}px;`;
            }}
        />
    </div>);
}

const RESIZABLE_PROPS = ["keepRatio", "throttleResize", "renderDirections", "edge", "zoom", "origin"];

export const BASIC_RESIZABLE_VANILLA_TEMPLATE = previewTemplate`
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: document.querySelector(".target"),
    resizable: true,
${DEFAULT_PROPS_TEMPLATE(RESIZABLE_PROPS)}
});

const frame = {
    translate: [0, 0],
    width: 100,
    height: 100,
};

moveable.on("resizeStart", ${RESIZE_START_TEMPLATE(CODE_TYPE.ARROW)}).on("resize", ${RESIZE_TEMPLATE(CODE_TYPE.ARROW)});
`;

export const BASIC_RESIZABLE_REACT_TEMPLATE = previewTemplate`
import * as React from "react";
import Moveable from "react-moveable";

export default function App() {
    const [target, setTarget] = React.useState();
    const [frame] = React.useState({
        translate: [0, 0],
        width: 100,
        height: 100,
    });
    React.useEffect(() => {
        setTarget(document.querySelector(".target")!);
    }, []);
    return <div className="container">
        <div className="target">Target</div>
        <Moveable
            target={target}
            resizable={true}
${JSX_PROPS_TEMPLATE(RESIZABLE_PROPS, 12)}
            onResizeStart={${codeIndent(RESIZE_START_TEMPLATE(CODE_TYPE.ARROW), { indent: 12 })}}
            onResize={${codeIndent(RESIZE_TEMPLATE(CODE_TYPE.ARROW), { indent: 12 })}}
        />
    </div>;
}
`;

export const BASIC_RESIZABLE_ANGULAR_HTML_TEMPLATE = previewTemplate`
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [resizable]="true"
${ANGULAR_PROPS_TEMPLATE(RESIZABLE_PROPS)}
    (resizeStart)="onResizeStart($event)"
    (resize)="onResize($event)"
></ngx-moveable>
`;
export const BASIC_RESIZABLE_ANGULAR_COMPONENT_TEMPLATE = previewTemplate`
import { Component } from "@angular/core";

@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    frame = {
        width: 100,
        height: 100,
        translate: [0, 0],
    };
    ${codeIndent(RESIZE_START_TEMPLATE(CODE_TYPE.METHOD), { indent: 4 })}
    ${codeIndent(RESIZE_TEMPLATE(CODE_TYPE.METHOD), { indent: 4 })}
}
`;
export const BASIC_RESIZABLE_SVELTE_TEMPLATE = `
<script>
    import Moveable from "svelte-moveable";

    const frame = {
        width: 100,
        height: 100,
        translate: [0, 0],
    };
    let target;
</script>
<style>
    ${codeIndent(BASIC_CSS_TEMPLATE, { indent: 4 })}
</style>
`;
export const BASIC_RESIZABLE_SVELTE_JSX_TEMPLATE = previewTemplate`
<div class="target" bind:this={target}>Target</div>
<Moveable
    target={target}
    resizable={true}
    ${JSX_PROPS_TEMPLATE(RESIZABLE_PROPS, 4)}
    on:resizeStart={${codeIndent(RESIZE_START_TEMPLATE(CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}
    on:resize={${codeIndent(RESIZE_TEMPLATE(CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}
/>
`;
