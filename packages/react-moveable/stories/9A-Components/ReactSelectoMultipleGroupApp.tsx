import { isArray } from "@daybrush/utils";
import * as React from "react";
import Selecto from "react-selecto";
import Moveable, { MoveableTargetGroupsType } from "../../src/react-moveable";
import "./cube.css";


function inGroup(group: MoveableTargetGroupsType, target: HTMLElement | SVGElement): boolean {
    return group.some(child => {
        if (child === target) {
            return true;
        }
        if (isArray(child)) {
            return inGroup(child, target);
        }
        return false;
    });
}
function groupBySelected(
    selected: Array<HTMLElement | SVGElement>,
    getRootGroup: (element: HTMLElement | SVGElement) => MoveableTargetGroupsType | null | undefined,
) {
    const group: MoveableTargetGroupsType = [];

    selected.forEach(element => {
        if (inGroup(group, element)) {
            return;
        }
        const rootGroup = getRootGroup(element);

        if (rootGroup) {
            group.push(rootGroup);
        } else {
            group.push(element);
        }
    });

    return group;
}

export default function App() {
    const [targets, setTargets] = React.useState<MoveableTargetGroupsType>([]);
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
                rotatable={true}
                scalable={true}
                target={targets}
                onClickGroup={e => {
                    selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
                }}
                onDrag={e => {
                    e.target.style.transform = e.transform;
                }}
                onRenderGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.cssText += ev.cssText;
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
                    // Must have use deep flat
                    const flatted = targets.flat(3) as Array<HTMLElement | SVGElement>;
                    if (
                        moveable.isMoveableElement(target)
                        || flatted.some(t => t === target || t.contains(target))
                    ) {
                        e.stop();
                    }
                }}
                onSelectEnd={e => {
                    const moveable = moveableRef.current!;
                    if (e.isDragStart) {
                        e.inputEvent.preventDefault();

                        moveable.waitToChangeTarget().then(() => {
                            moveable.dragStart(e.inputEvent);
                        });
                    }
                    const selected = e.selected;

                    const elements = e.currentTarget.getSelectableElements();

                    // [[0, 1], 2], 3, 4, [5, 6], 7, 8, 9
                    const groups: MoveableTargetGroupsType[] = [
                        [[elements[0], elements[1]], elements[2]],
                        [elements[5], elements[6], elements[7]],
                    ];

                    const targetGroups = groupBySelected(selected, element => {
                        return groups.find(group => inGroup(group, element));
                    });

                    console.log(targetGroups);

                    e.currentTarget.setSelectedTargets(targetGroups.flat(3) as Array<HTMLElement | SVGElement>);
                    setTargets(targetGroups);
                }}
            ></Selecto>

            <div className="elements selecto-area">
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
