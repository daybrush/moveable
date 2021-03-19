import * as React from "react";
import Moveable from "../../../src/react-moveable";

export default function App(props: Record<string, any>) {
    const widthInputRef = React.useRef<HTMLInputElement>(null);
    const heightInputRef = React.useRef<HTMLInputElement>(null);
    const moveableRef = React.useRef<Moveable>(null);
    const [frames] = React.useState([{
        translate: [0, 0],
    }, {
        translate: [0, 0],
    }, {
        translate: [0, 0],
    }]);
    const [requestCallbacks] = React.useState(() => {
        function request() {
            moveableRef.current!.request("resizable", {
                offsetWidth: parseInt(widthInputRef.current!.value),
                offsetHeight: parseInt(heightInputRef.current!.value),
            }, true);
        }
        return {
            onInput(e: any) {
                const ev = (e.nativeEvent || e) as InputEvent;

                if (typeof ev.data === "undefined") {
                    request();
                }
            },
            onKeyUp(e: any) {
                e.stopPropagation();

                // enter
                if (e.keyCode === 13) {
                    request();
                }
            },
        };
    });

    return <div className="root">
        <div>
            width: <input ref={widthInputRef} type="number" defaultValue="280" {...requestCallbacks}></input>&nbsp;
            height: <input ref={heightInputRef} type="number" defaultValue="230" {...requestCallbacks}></input>
        </div>
        <div className="container">
            <div className="target target1">Target1</div>
            <div className="target target2">Target2</div>
            <div className="target target3">Target3</div>
            <Moveable
                ref={moveableRef}
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
                onResizeGroupEnd={(e) => {
                    const rect = e.moveable.getRect();
                    console.log(rect);
                    requestAnimationFrame(() => {
                        const rect = e.moveable.getRect();

                        widthInputRef.current!.value = `${rect.offsetWidth}`;
                        heightInputRef.current!.value = `${rect.offsetHeight}`;
                    });
                }}
            />
        </div>
    </div>;
};
