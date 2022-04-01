import * as React from "react";
import Selecto from "react-selecto";
import Moveable from "../../../src/react-moveable";
import "./cube.css";


export default function App() {
    const [targets, setTargets] = React.useState<Array<SVGElement | HTMLElement>>([]);
    const [frameMap] = React.useState(() => new Map());
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);
    const cubes = [];

    for (let i = 0; i < 30; ++i) {
        cubes.push(i);
    }

    return <div className="root">
        <div className="container">
            <Moveable
                ref={moveableRef}
                draggable={true}
                target={targets}
                onClickGroup={e => {
                    selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
                }}
                onDrag={e => {
                    e.target.style.transform = e.transform;
                }}
                onDragGroupStart={e => {
                    e.events.forEach(ev => {
                        const target = ev.target;

                        if (!frameMap.has(target)) {
                            frameMap.set(target, {
                                translate: [0, 0],
                            });
                        }
                        const frame = frameMap.get(target);

                        ev.set(frame.translate);
                    });
                }}
                onDragGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.transform = ev.transform;
                    });
                }}
            ></Moveable>
            <Selecto
                ref={selectoRef}
                dragContainer={window}
                selectableTargets={[".selecto-area .cube"]}
                hitRate={0}
                selectByClick={true}
                selectFromInside={false}
                toggleContinueSelect={["shift"]}
                ratio={0}
                onDragStart={e => {
                    const moveable = moveableRef.current!;
                    const target = e.inputEvent.target;
                    if (
                        moveable.isMoveableElement(target)
                        || targets.some(t => t === target || t.contains(target))
                    ) {
                        e.stop();
                    }
                }}
                onSelectEnd={e => {
                    const moveable = moveableRef.current!;
                    setTargets(e.selected);

                    if (e.isDragStart) {
                        e.inputEvent.preventDefault();

                        setTimeout(() => {
                            moveable.dragStart(e.inputEvent);
                        });
                    }
                }}
            ></Selecto>

            <div className="elements selecto-area">
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
