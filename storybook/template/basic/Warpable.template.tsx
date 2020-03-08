import * as React from "react";
import Moveable from "react-moveable";
import {
    CODE_TYPE, codeIndent, previewTemplate,
    DEFAULT_PROPS_TEMPLATE, JSX_PROPS_TEMPLATE, ANGULAR_PROPS_TEMPLATE,
} from "storybook-addon-preview";
import { WARP_START_TEMPLATE, WARP_TEMPLATE } from "./events.template";
import { BASIC_CSS_TEMPLATE } from "./template";

export default function RotatableApp(props: any) {
    const [target, setTarget] = React.useState<HTMLElement>();
    const [frame] = React.useState({
        matrix: [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ],
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
            warpable={true}
            {...moveableProps}
            onWarpStart={e => {
                e.set(frame.matrix);
            }}
            onWarp={e => {
                frame.matrix = e.matrix;

                e.target.style.cssText = `transform: matrix3d(${e.matrix.join(",")})`;
            }}
        />
    </div>);
}

const WARPABLE_PROPS = ["renderDirections", "edge", "zoom", "origin"];

export const BASIC_WARPABLE_VANILLA_TEMPLATE = previewTemplate`
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: document.querySelector(".target"),
    warpable: true,
${DEFAULT_PROPS_TEMPLATE(WARPABLE_PROPS)}
});

const frame = {
    matrix: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ],
};

moveable.on("warpStart", ${WARP_START_TEMPLATE(CODE_TYPE.ARROW)}).on("warp", ${WARP_TEMPLATE(CODE_TYPE.ARROW)});
`;

export const BASIC_WARPABLE_REACT_TEMPLATE = previewTemplate`
import * as React from "react";
import Moveable from "react-moveable";

export default function App() {
    const [target, setTarget] = React.useState();
    const [frame] = React.useState({
        matrix: [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ],
    });
    React.useEffect(() => {
        setTarget(document.querySelector(".target")!);
    }, []);
    return <div className="container">
        <div className="target">Target</div>
        <Moveable
            target={target}
            warpable={true}
${JSX_PROPS_TEMPLATE(WARPABLE_PROPS, 12)}
            onScaleStart={${codeIndent(WARP_START_TEMPLATE(CODE_TYPE.ARROW), { indent: 12 })}}
            onScale={${codeIndent(WARP_TEMPLATE(CODE_TYPE.ARROW), { indent: 12 })}}
        />
    </div>;
}
`;

export const BASIC_WARPABLE_ANGULAR_HTML_TEMPLATE = previewTemplate`
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [warpable]="true"
${ANGULAR_PROPS_TEMPLATE(WARPABLE_PROPS)}
    (warpStart)="onScaleStart($event)"
    (warp)="onScale($event)"
></ngx-moveable>
`;
export const BASIC_WARPABLE_ANGULAR_COMPONENT_TEMPLATE = previewTemplate`
import { Component } from "@angular/core";

@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    frame = {
        matrix: [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ],
    };
    ${codeIndent(WARP_START_TEMPLATE(CODE_TYPE.METHOD), { indent: 4 })}
    ${codeIndent(WARP_TEMPLATE(CODE_TYPE.METHOD), { indent: 4 })}
}
`;
export const BASIC_WARPABLE_SVELTE_TEMPLATE = `
<script>
    import Moveable from "svelte-moveable";

    const frame = {
        matrix: [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ],
    };
    let target;
</script>
<style>
    ${codeIndent(BASIC_CSS_TEMPLATE, { indent: 4 })}
</style>
`;
export const BASIC_WARPABLE_SVELTE_JSX_TEMPLATE = previewTemplate`
<div class="target" bind:this={target}>Target</div>
<Moveable
    target={target}
    warpable={true}
${JSX_PROPS_TEMPLATE(WARPABLE_PROPS, 4)}
    on:warpStart={${codeIndent(WARP_START_TEMPLATE(CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}
    on:warp={${codeIndent(WARP_TEMPLATE(CODE_TYPE.CUSTOM_EVENT_ARROW), { indent: 4 })}}
/>
`;
