import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { DEFAULT_REACT_CODESANDBOX, withPreview } from "storybook-addon-preview";
import "../../template/basic/basic.css";
import { DraggableProps, makeMoveable, ResizableProps, RotatableProps, Rotatable, Draggable, Resizable } from "react-moveable";
import { useRef } from "react";
import { REACT_CODESANDBOX } from "../../template/codesandbox";
import MoveableHelper from "moveable-helper";
import { BASIC_CSS_TEMPLATE } from "../../template/basic/template";

const story = storiesOf("Support Tree Shaking", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

const Moveable = makeMoveable<DraggableProps & ResizableProps & RotatableProps>([
    Draggable,
    Resizable,
    Rotatable,
]);

function TreeShakingApp() {
    const [helper] = React.useState(() => {
        return new MoveableHelper();
    })
    const targetRef = React.useRef<HTMLDivElement>(null);
    return <div className="container">
        <div className="target" ref={targetRef}>Target</div>
        <Moveable
            target={targetRef}
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
story.add("Use only Draggable, Resizable, Rotatable(30% size reduction)", () => {
    return <TreeShakingApp />;
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
import { makeMoveable, DraggableProps, ResizableProps, RotatableProps, Rotatable, Draggable, Resizable } from "react-moveable";
import MoveableHelper from "moveable-helper";


// In order to use only some able, make a component with makeMoveable function.
const Moveable = makeMoveable<DraggableProps & ResizableProps & RotatableProps>([
    Draggable,
    Resizable,
    Rotatable,
]);

export default function TreeShakingApp() {
    const [helper] = React.useState(() => {
        return new MoveableHelper();
    })
    const targetRef = React.useRef<HTMLDivElement>(null);
    return <div className="container">
        <div className="target" ref={targetRef}>Target</div>
        <Moveable
            target={targetRef}
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
