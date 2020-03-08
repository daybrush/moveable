import * as React from "react";
import Moveable from "react-moveable";
import {
    CODE_TYPE, codeIndent, previewTemplate,
    DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, ANGULAR_PROPS_TEMPLATE,
} from "storybook-addon-preview";
import { SCALE_START_TEMPLATE, SCALE_TEMPLATE } from "./events.template";
import { BASIC_CSS_TEMPLATE } from "./template";

export default function ScalableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        scale: [1, 1],
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
            scalable={true}
            {...moveableProps}
            onScaleStart={e => {
                e.set(frame.scale);
                e.dragStart && e.dragStart.set(frame.translate);
            }}
            onScale={e => {
                frame.scale = e.scale;
                frame.translate = e.drag.beforeTranslate;

                e.target.style.cssText
                    = `transform: translate(${frame.translate[0]}px, ${frame.translate[1]}px)`
                    + ` scale(${e.scale[0]}, ${e.scale[1]})`;
            }}
        />
    </div>);
}

const SCALABLE_PROPS = ["keepRatio", "throttleScale", "renderDirections", "edge", "zoom", "origin"];

export const BASIC_SCALABLE_VANILLA_TEMPLATE = previewTemplate`
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: document.querySelector(".target"),
    scalable: true,
${DEFAULT_PROPS_TEMPLATE(SCALABLE_PROPS)}
});

const frame = {
    translate: [0, 0],
    scale: [1, 1],
};

moveable.on("scaleStart", ${SCALE_START_TEMPLATE(CODE_TYPE.ARROW)}).on("scale", ${SCALE_TEMPLATE(CODE_TYPE.ARROW)});
`;

export const BASIC_SCALABLE_REACT_TEMPLATE = previewTemplate`
import * as React from "react";
import Moveable from "react-moveable";

export default function App() {
    const [target, setTarget] = React.useState();
    const [frame] = React.useState({
        translate: [0, 0],
        scale: [1, 1],
    });
    React.useEffect(() => {
        setTarget(document.querySelector(".target")!);
    }, []);
    return <div className="container">
        <div className="target">Target</div>
        <Moveable
            target={target}
            scalable={true}
${JSX_PROPS_TEMPLATE(SCALABLE_PROPS, 12)}
            onScaleStart={${codeIndent(SCALE_START_TEMPLATE(CODE_TYPE.ARROW), { indent: 12 })}}
            onScale={${codeIndent(SCALE_TEMPLATE(CODE_TYPE.ARROW), { indent: 12 })}}
        />
    </div>;
}
`;

export const BASIC_SCALABLE_ANGULAR_HTML_TEMPLATE = previewTemplate`
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [scalable]="true"
${ANGULAR_PROPS_TEMPLATE(SCALABLE_PROPS)}
    (scaleStart)="onScaleStart($event)"
    (scale)="onScale($event)"
></ngx-moveable>
`;
export const BASIC_SCALABLE_ANGULAR_COMPONENT_TEMPLATE = previewTemplate`
import { Component } from "@angular/core";

@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    frame = {
        scale: [1, 1],
        translate: [0, 0],
    };
    ${codeIndent(SCALE_START_TEMPLATE(CODE_TYPE.METHOD), { indent: 4 })}
    ${codeIndent(SCALE_TEMPLATE(CODE_TYPE.METHOD), { indent: 4 })}
}
`;
export const BASIC_SCALABLE_SVELTE_TEMPLATE = `
<script>
    import Moveable from "svelte-moveable";

    const frame = {
        scale: [1, 1],
        translate: [0, 0],
    };
    let target;
</script>
<style>
    ${codeIndent(BASIC_CSS_TEMPLATE, { indent: 4 })}
</style>
`;
export const BASIC_SCALABLE_SVELTE_JSX_TEMPLATE = previewTemplate`
<div class="target" bind:this={target}>Target</div>
<Moveable
    target={target}
    scalable={true}
${JSX_PROPS_TEMPLATE(SCALABLE_PROPS, 4)}
    on:scaleStart={${codeIndent(SCALE_START_TEMPLATE(CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}
    on:scale={${codeIndent(SCALE_TEMPLATE(CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}
/>
`;
