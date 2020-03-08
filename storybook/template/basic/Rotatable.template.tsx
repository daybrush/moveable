import * as React from "react";
import Moveable from "react-moveable";
import {
    CODE_TYPE, codeIndent, previewTemplate,
    DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, ANGULAR_PROPS_TEMPLATE,
} from "storybook-addon-preview";
import { ROTATE_START_TEMPLATE, ROTATE_TEMPLATE } from "./events.template";
import { BASIC_CSS_TEMPLATE } from "./template";

export default function RotatableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        rotate: 0,
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
            rotatable={true}
            {...moveableProps}
            onRotateStart={e => {
                e.set(frame.rotate);
            }}
            onRotate={e => {
                frame.rotate = e.beforeRotate;

                e.target.style.cssText = `transform: rotate(${e.rotate}deg)`;
            }}
        />
    </div>);
}

const ROTATABLE_PROPS = ["throttleRotate", "rotationPosition", "zoom", "origin"];

export const BASIC_ROTATABLE_VANILLA_TEMPLATE = previewTemplate`
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: document.querySelector(".target"),
    rotatable: true,
${DEFAULT_PROPS_TEMPLATE(ROTATABLE_PROPS)}
});

const frame = {
    rotate: 0,
};

moveable.on("rotateStart", ${ROTATE_START_TEMPLATE(CODE_TYPE.ARROW)}).on("rotate", ${ROTATE_TEMPLATE(CODE_TYPE.ARROW)});
`;

export const BASIC_ROTATABLE_REACT_TEMPLATE = previewTemplate`
import * as React from "react";
import Moveable from "react-moveable";

export default function App() {
    const [target, setTarget] = React.useState();
    const [frame] = React.useState({
        rotate: 0,
    });
    React.useEffect(() => {
        setTarget(document.querySelector(".target")!);
    }, []);
    return <div className="container">
        <div className="target">Target</div>
        <Moveable
            target={target}
            rotatable={true}
${JSX_PROPS_TEMPLATE(ROTATABLE_PROPS, 12)}
            onScaleStart={${codeIndent(ROTATE_START_TEMPLATE(CODE_TYPE.ARROW), { indent: 12 })}}
            onScale={${codeIndent(ROTATE_TEMPLATE(CODE_TYPE.ARROW), { indent: 12 })}}
        />
    </div>;
}
`;

export const BASIC_ROTATABLE_ANGULAR_HTML_TEMPLATE = previewTemplate`
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [rotatable]="true"
${ANGULAR_PROPS_TEMPLATE(ROTATABLE_PROPS)}
    (rotateStart)="onScaleStart($event)"
    (rotate)="onScale($event)"
></ngx-moveable>
`;
export const BASIC_ROTATABLE_ANGULAR_COMPONENT_TEMPLATE = previewTemplate`
import { Component } from "@angular/core";

@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    frame = {
        rotate: 0,
    };
    ${codeIndent(ROTATE_START_TEMPLATE(CODE_TYPE.METHOD), { indent: 4 })}
    ${codeIndent(ROTATE_TEMPLATE(CODE_TYPE.METHOD), { indent: 4 })}
}
`;
export const BASIC_ROTATABLE_SVELTE_TEMPLATE = `
<script>
    import Moveable from "svelte-moveable";

    const frame = {
        rotate: 0,
    };
    let target;
</script>
<style>
    ${codeIndent(BASIC_CSS_TEMPLATE, { indent: 4 })}
</style>
`;
export const BASIC_ROTATABLE_SVELTE_JSX_TEMPLATE = previewTemplate`
<div class="target" bind:this={target}>Target</div>
<Moveable
    target={target}
    rotatable={true}
${JSX_PROPS_TEMPLATE(ROTATABLE_PROPS, 4)}
    on:rotateStart={${codeIndent(ROTATE_START_TEMPLATE(CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}
    on:rotate={${codeIndent(ROTATE_TEMPLATE(CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}
/>
`;
