import { deepFlat } from "@daybrush/utils";
import * as React from "react";
import Selecto from "react-selecto";
import Moveable, { MoveableTargetGroupsType } from "@/react-moveable";
import { GroupManager, TargetList } from "@/helper";

export default function App() {
    const groupManager = React.useMemo<GroupManager>(() => new GroupManager([]), []);
    const [targets, setTargets] = React.useState<MoveableTargetGroupsType>([]);
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);
    const cubes = [];

    for (let i = 0; i < 30; ++i) {
        cubes.push(i);
    }
    const setSelectedTargets = React.useCallback((nextTargetes: MoveableTargetGroupsType) => {
        selectoRef.current!.setSelectedTargets(deepFlat(nextTargetes));
        setTargets(nextTargetes);
    }, []);

    React.useEffect(() => {
        // [[0, 1], 2], 3, 4, [5, 6], 7, 8, 9
        const elements = selectoRef.current!.getSelectableElements();

        groupManager.set([], elements);
    }, []);

    return <div className="root">
        <div className="container">
            <button onClick={() => {
                const nextGroup = groupManager.group(targets, true);

                if (nextGroup) {
                    setTargets(nextGroup);
                }
            }}>Group</button>
            &nbsp;
            <button onClick={() => {
                const nextGroup = groupManager.ungroup(targets);

                if (nextGroup) {
                    setTargets(nextGroup);
                }
            }}>Ungroup</button>
            <Moveable
                ref={moveableRef}
                draggable={true}
                rotatable={true}
                scalable={true}
                target={targets}
                onDrag={e => {
                    e.target.style.transform = e.transform;
                }}
                onRenderGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.cssText += ev.cssText;
                    });
                }}
                onClickGroup={e => {
                    if (!e.moveableTarget) {
                        setSelectedTargets([]);
                        return;
                    }
                    if (e.isDouble) {
                        const childs = groupManager.selectSubChilds(targets, e.moveableTarget);

                        setSelectedTargets(childs.targets());
                        return;
                    }
                    if (e.isTrusted) {
                        selectoRef.current!.clickTarget(e.inputEvent, e.moveableTarget);
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
                    const flatted = deepFlat(targets);

                    if (
                        target.tagName === "BUTTON"
                        || moveable.isMoveableElement(target)
                        || flatted.some(t => t === target || t.contains(target))
                    ) {
                        e.stop();
                    }
                }}
                onSelectEnd={e => {
                    const {
                        isDragStart,
                        isClick,
                        added,
                        removed,
                        inputEvent,
                    } = e;
                    const moveable = moveableRef.current!;

                    if (isDragStart) {
                        inputEvent.preventDefault();

                        moveable.waitToChangeTarget().then(() => {
                            moveable.dragStart(inputEvent);
                        });
                    }
                    let nextChilds: TargetList;

                    if (isDragStart || isClick) {
                        nextChilds = groupManager.selectCompletedChilds(targets, added, removed);
                    } else {
                        nextChilds = groupManager.selectSameDepthChilds(targets, added, removed);
                    }

                    e.currentTarget.setSelectedTargets(nextChilds.flatten());
                    setSelectedTargets(nextChilds.targets());
                }}
            ></Selecto>
            <div className="elements selecto-area">
                {cubes.map(i => <div className="cube" key={i}>{i}</div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
