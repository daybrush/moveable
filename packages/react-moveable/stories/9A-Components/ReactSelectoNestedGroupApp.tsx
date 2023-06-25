import * as React from "react";
import Selecto from "react-selecto";
import Moveable from "@/react-moveable";
import { diff } from "@egjs/children-differ";


export default function App() {
    const [targets, setTargets] = React.useState<Array<SVGElement | HTMLElement>>([]);
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);
    const cubes: number[] = [];

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
                onDragGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.transform = ev.transform;
                    });
                }}
                onClick={e => {
                    if (e.isDouble) {
                        const inputTarget = e.inputTarget as HTMLElement;
                        const selectableElements = selectoRef.current!.getSelectableElements();

                        if (selectableElements.includes(inputTarget)) {
                            selectoRef.current!.setSelectedTargets([inputTarget]);
                            setTargets([inputTarget]);
                        }
                    }
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
                    let selected = e.selected;

                    // excludes child elements.
                    selected = selected.filter(target => {
                        return selected.every(target2 => {
                            return target === target2 || !target2.contains(target);
                        });
                    });

                    const result = diff(e.startSelected, selected);

                    e.currentTarget.setSelectedTargets(selected);


                    if (!result.added.length && !result.removed.length) {
                        return;
                    }
                    if (e.isDragStartEnd) {
                        e.inputEvent.preventDefault();

                        moveable.waitToChangeTarget().then(() => {
                            moveable.dragStart(e.inputEvent);
                        });
                    }
                    setTargets(selected);
                }}
            ></Selecto>
            <div className="elements selecto-area">
                {cubes.map(i => {
                    if (i === 2) {
                        return <div className="cube" key={i} style={{
                            width: "100px",
                            height: "50px",
                        }}>
                            {i}
                            <div className="cube" key={i}>{i}</div>
                        </div>;
                    }
                    return <div className="cube" key={i}>{i}</div>;
                })}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
