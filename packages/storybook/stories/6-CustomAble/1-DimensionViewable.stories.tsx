import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { DEFAULT_REACT_CODESANDBOX, withPreview } from "storybook-addon-preview";
import "../../template/basic/basic.css";
import Moveable, { MoveableManagerInterface, Renderer } from "react-moveable";
import { useRef } from "react";
import { REACT_CODESANDBOX } from "../../template/codesandbox";
import MoveableHelper from "moveable-helper";
import { BASIC_CSS_TEMPLATE } from "../../template/basic/template";

const story = storiesOf("Make Custom Able", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

const DimensionViewable = {
    name: "dimensionViewable",
    props: {},
    events: {},
    render(moveable: MoveableManagerInterface<any, any>, React: Renderer) {
        const rect = moveable.getRect();

        // Add key (required)
        // Add class prefix moveable-(required)
        return <div key={"dimension-viewer"} className={"moveable-dimension"} style={{
            position: "absolute",
            left: `${rect.width / 2}px`,
            top: `${rect.height + 20}px`,
            background: "#4af",
            borderRadius: "2px",
            padding: "2px 4px",
            color: "white",
            fontSize: "13px",
            whiteSpace: "nowrap",
            fontWeight: "bold",
            willChange: "transform",
            transform: `translate(-50%, 0px)`,
        }}>
            {Math.round(rect.offsetWidth)} x {Math.round(rect.offsetHeight)}
        </div>
    }
} as const;
function DimensionViewableApp() {
    const [helper] = React.useState(() => {
        return new MoveableHelper();
    })
    const targetRef = React.useRef<HTMLDivElement>(null);
    return <div className="container">
        <div className="target" ref={targetRef}>Target</div>
    <Moveable
        target={targetRef}
        ables={[DimensionViewable]}
        draggable={true}
        resizable={true}
        rotatable={true}
        onDragStart={helper.onDragStart}
        onDrag={helper.onDrag}
        onResizeStart={helper.onResizeStart}
        onResize={helper.onResize}
        onRotateStart={helper.onRotateStart}
        onRotate={helper.onRotate}
        props={{
            dimensionViewable: true,
        }}
    />
</div>;
}
story.add("DimensionViewable", () => {
    return <DimensionViewableApp />;
}, {
    preview: [
        {
            tab: "CSS",
            template: BASIC_CSS_TEMPLATE,
            language: "css",
        },
        {
            tab: "React",
            template: `
import * as React from "react";
import Moveable, { MoveableManagerInterface, Renderer } from "react-moveable";
import MoveableHelper from "moveable-helper";


const DimensionViewable = {
    name: "dimensionViewable",
    props: {},
    events: {},
    render(moveable: MoveableManagerInterface<any, any>, React: Renderer) {
        const rect = moveable.getRect();

        // Add key (required)
        // Add class prefix moveable-(required)
        return <div key={"dimension-viewer"} className={"moveable-dimension"} style={{
            position: "absolute",
            left: ${"`$"}{rect.width / 2}px${"`"},
            top: ${"`$"}{rect.height + 20}px${"`"},
            background: "#4af",
            borderRadius: "2px",
            padding: "2px 4px",
            color: "white",
            fontSize: "13px",
            whiteSpace: "nowrap",
            fontWeight: "bold",
            willChange: "transform",
            transform: "translate(-50%, 0px)",
        }}>
            {Math.round(rect.offsetWidth)} x {Math.round(rect.offsetHeight)}
        </div>
    }
} as const;

export default function App() {
    const [helper] = React.useState(() => {
        return new MoveableHelper();
    })
    const targetRef = React.useRef<HTMLDivElement>(null);
    return <div className="container">
        <div className="target" ref={targetRef}>Target</div>
        <Moveable
            target={targetRef}
            ables={[DimensionViewable]}
            props={{
                dimensionViewable: true,
            }}


            draggable={true}
            resizable={true}
            rotatable={true}
            onDragStart={helper.onDragStart}
            onDrag={helper.onDrag}
            onResizeStart={helper.onResizeStart}
            onResize={helper.onResize}
            onRotateStart={helper.onRotateStart}
            onRotate={helper.onRotate}
            />
    </div>;
}
            `,
            language: "tsx",
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable", "moveable-helper"]),
        },
    ]
});
