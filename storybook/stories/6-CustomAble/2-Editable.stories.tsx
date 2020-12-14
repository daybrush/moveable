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

const Editable = {
    name: "editable",
    props: {},
    events: {},
    render(moveable: MoveableManagerInterface<any, any>, React: Renderer) {
        const rect = moveable.getRect();
        const { pos2 } = moveable.state;

        // Add key (required)
        // Add class prefix moveable-(required)
        const EditableViewer = React.useCSS("div", `
        {
            position: absolute;
            left: 0px;
            top: 0px;
            will-change: transform;
            transform-origin: 0px 0px;
        }
        .moveable-button {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
            background: #4af;
            border-radius: 4px;
            appearance: none;
            border: 0;
            color: white;
            font-weight: bold;
        }
            `);
        return <EditableViewer key={"editable-viewer"} className={"moveable-editable"} style={{
            transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px)`,
        }}>
            <button className="moveable-button" onClick={() => {
                alert("+");
            }}>+</button>
            <button className="moveable-button" onClick={() => {
                alert("-");
            }}>-</button>
        </EditableViewer>
    }
} as const;
function EditableApp() {
    const [helper] = React.useState(() => {
        return new MoveableHelper();
    })
    const targetRef = React.useRef<HTMLDivElement>(null);
    return <div className="container">
        <div className="target" ref={targetRef}>Target</div>
    <Moveable
        target={targetRef}
        ables={[Editable]}
        props={{
            editable: true,
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
story.add("Editable with buttons", () => {
    return <EditableApp />;
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


const Editable = {
    name: "editable",
    props: {},
    events: {},
    render(moveable: MoveableManagerInterface<any, any>, React: Renderer) {
        const rect = moveable.getRect();
        const { pos2 } = moveable.state;

        // use css for able
        const EditableViewer = React.useCSS("div", ${"`"}
        {
            position: absolute;
            left: 0px;
            top: 0px;
            will-change: transform;
            transform-origin: 0px 0px;
        }
        .moveable-button {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
            background: #4af;
            border-radius: 4px;
            appearance: none;
            border: 0;
            color: white;
            font-weight: bold;
        }
        ${"`"});
        // Add key (required)
        // Add class prefix moveable-(required)
        return <EditableViewer key="editable-viewer" className={"moveable-editable"} style={{
            transform: ${"`"}translate(${"$"}{pos2[0]}px, (${"$"}{pos2[1]}px) rotate((${"$"}{rect.rotation}deg) translate(10px)${"`"},
        }}>
            <button className="moveable-button" onClick={() => {
                alert("+");
            }}>+</button>
            <button className="moveable-button" onClick={() => {
                alert("-");
            }}>-</button>
        </EditableViewer>;
    }
} as const;
export default function EditableApp() {
    const [helper] = React.useState(() => {
        return new MoveableHelper();
    })
    const targetRef = React.useRef<HTMLDivElement>(null);
    return <div className="container">
        <div className="target" ref={targetRef}>Target</div>
        <Moveable
            target={targetRef}
            ables={[Editable]}
            props={{
                editable: true,
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
