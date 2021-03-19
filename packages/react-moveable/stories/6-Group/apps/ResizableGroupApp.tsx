import * as React from "react";
import Moveable from "../../../src/react-moveable";

export default function App(props: Record<string, any>) {
    const [frames] = React.useState([{
        translate: [0, 0],
    }, {
        translate: [0, 0],
    }, {
        translate: [0, 0],
    }]);
    return <div className="container">
        <div className="target target1">Target1</div>
        <div className="target target2">Target2</div>
        <div className="target target3">Target3</div>
        <Moveable
            target={".target"}
            resizable={props.resizable}
            keepRatio={props.keepRatio}
            throttleResize={props.throttleResize}
            renderDirections={props.renderDirections}
            onResizeGroupStart={({ events, setMin, setMax }) => {
                setMin([props.minWidth, props.minHeight]);
                setMax([props.maxWidth, props.maxHeight]);

                events.forEach((ev, i) => {
                    ev.dragStart && ev.dragStart.set(frames[i].translate);
                });
            }}
            onResizeGroup={({ events }) => {
                events.forEach((ev, i) => {
                    frames[i].translate = ev.drag.beforeTranslate;
                    ev.target.style.width = `${ev.width}px`;
                    ev.target.style.height = `${ev.height}px`;
                    ev.target.style.transform
                        = `translate(${ev.drag.beforeTranslate[0]}px, ${ev.drag.beforeTranslate[1]}px)`;
                });
            }}
        />
    </div>;
};
