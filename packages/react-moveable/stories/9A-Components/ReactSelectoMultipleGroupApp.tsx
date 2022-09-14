import { isArray } from "@daybrush/utils";
import * as React from "react";
import { useKeycon } from "react-keycon";
import Selecto from "react-selecto";
import Moveable, { MoveableTargetGroupsType } from "../../src/react-moveable";
import "./cube.css";
import { createRootChild, GroupArrayChild } from "./helper/group";

// function findSameDepthGroups(
//     groups: MoveableTargetGroupsType,
//     targets: MoveableTargetGroupsType,
// ): MoveableTargetGroupsType | null {
//     let childGroups: MoveableTargetGroupsType | null = null;

//     const result = groups.some(child => {
//         if (isArray(child)) {
//             // find group
//             if (isSameGroups(child, targets)) {
//                 return true;
//             }
//             const target = targets.find(target => {
//                 return isArray(target) && isSameGroups(target, child);
//             });

//             if (target) {
//                 return true;
//             }
//             const nextGroups = findSameDepthGroups(child, targets);

//             if (nextGroups) {
//                 childGroups = nextGroups;
//             }
//             return;
//         }

//         if (targets.indexOf(child) > -1) {
//             return true;
//         }
//     });

//     if (result) {
//         return groups;
//     }

//     return childGroups || null;
// }
export default function App() {
    const { isKeydown: isCommand } = useKeycon({ keys: "meta" });
    const { isKeydown: isShift } = useKeycon({ keys: "shift" });
    const rootGroupRef = React.useRef<GroupArrayChild>() ;
    const [targets, setTargets] = React.useState<MoveableTargetGroupsType>([]);
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);
    const cubes = [];

    for (let i = 0; i < 30; ++i) {
        cubes.push(i);
    }

    React.useEffect(() => {
        // [[0, 1], 2], 3, 4, [5, 6], 7, 8, 9
        const elements = selectoRef.current!.getSelectableElements();

        rootGroupRef.current = createRootChild(elements, [
            [[elements[0], elements[1]], elements[2]],
            [elements[5], elements[6], elements[7]],
        ]);
    }, []);

    return <div className="root">
        <div className="container">
            <Moveable
                ref={moveableRef}
                draggable={true}
                rotatable={true}
                scalable={true}
                target={targets}
                onClickGroup={e => {
                    if (!e.moveableTarget) {
                        selectoRef.current!.setSelectedTargets([]);
                        setTargets([]);
                        return;
                    }
                    if (e.isDouble) {
                        const nextChild = rootGroupRef.current!.findNextChild(e.moveableTarget, targets);
                        const nextTargets = nextChild ? [nextChild.toTargetGroups()] : [e.moveableTarget];

                        selectoRef.current!.setSelectedTargets(nextTargets.flat(3) as Array<HTMLElement | SVGElement>);
                        setTargets(nextTargets);
                        return;
                    }
                    selectoRef.current!.clickTarget(e.inputEvent, e.moveableTarget);
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
                    const {
                        startSelected,
                        isDragStart,
                        isClick,
                        added,
                        removed,
                        currentTarget,
                        inputEvent,
                    } = e;
                    const moveable = moveableRef.current!;

                    if (isDragStart) {
                        inputEvent.preventDefault();

                        moveable.waitToChangeTarget().then(() => {
                            moveable.dragStart(inputEvent);
                        });
                    }
                    const rootGroup = rootGroupRef.current!;
                    const nextTargets = [...targets];



                    // click alone
                    if (isDragStart || isClick) {
                        if (isCommand) {
                            // group can't be added, removed.
                            removed.forEach(element => {
                                const index = nextTargets.indexOf(element);

                                if (index > -1) {
                                    nextTargets.splice(index, 1);
                                }
                            });

                            // Targets can be added one by one
                            added.forEach(element => {
                                nextTargets.push(element);
                            });
                        } else {
                            // group can be added, removed.
                            removed.forEach(element => {
                                // Single Target
                                const index = nextTargets.indexOf(element);

                                if (index > -1) {
                                    // single target or group
                                    nextTargets.splice(index, 1);
                                    return;
                                }
                                // Group Target
                                const removedChild = isShift
                                    ? rootGroup.findNextChild(element, nextTargets)
                                    : rootGroup.findNextExactChild(element, nextTargets, removed);

                                if (removedChild) {
                                    const groupIndex = nextTargets.findIndex(target => {
                                        return isArray(target) && removedChild.compare(target);
                                    });

                                    if (groupIndex > -1) {
                                        nextTargets.splice(groupIndex, 1);
                                    }
                                }
                            });

                            added.forEach(element => {
                                const nextChild = rootGroup.findNextChild(element);

                                if (nextChild) {
                                    const cleanChild = nextChild.findCleanChild(element, startSelected);

                                    if (cleanChild) {
                                        nextTargets.push(cleanChild.toTargetGroups());
                                        return;
                                    }
                                }
                                nextTargets.push(element);
                            });
                        }
                    } else {
                        // // select same depth
                        // const sameDepthGroups = findSameDepthGroups(multipleGroups, nextTargets) || multipleGroups;

                        // // removed.forEach
                        // if (!sameDepthGroups || sameDepthGroups === multipleGroups) {
                        //     removed.forEach(element => {
                        //         // Single Target
                        //         const index = nextTargets.indexOf(element);

                        //         if (index > -1) {
                        //             // single target or group
                        //             nextTargets.splice(index, 1);
                        //             return;
                        //         }
                        //         const removedGroup = findPerfectGroups(nextTargets, element, removed);

                        //         if (removedGroup) {
                        //             if (isSameGroups(nextTargets, removedGroup)) {
                        //                 nextTargets = [];
                        //             } else {
                        //                 const groupIndex = nextTargets.findIndex(target => {
                        //                     return isArray(target) && isSameGroups(target, removedGroup);
                        //                 });

                        //                 if (groupIndex > -1) {
                        //                     nextTargets.splice(groupIndex, 1);
                        //                 }
                        //             }
                        //         }
                        //     });
                        //     const perfectGroups = groups.filter(child => {
                        //         if (isArray(child)) {
                        //             return isPerfectGroups(child, added);
                        //         } else {
                        //             return added.indexOf(child) > -1;
                        //         }
                        //     });

                        //     added.forEach(element => {


                        //         console.log(childGroups);
                        //         if (childGroups) {
                        //             const cleanGroups = findCleanChildGroups(childGroups, element, startSelected);

                        //             if (cleanGroups) {
                        //                 nextTargets.push(cleanGroups);
                        //                 return;
                        //             }
                        //         }
                        //         nextTargets.push(element);
                        //     });
                        // }

                        // console.log("SAME", groups, startSelected, sameDepthGroups);

                    }

                    console.log("SET", targets, nextTargets);
                    currentTarget.setSelectedTargets(nextTargets.flat(3) as Array<HTMLElement | SVGElement>);
                    setTargets(nextTargets);
                }}
            ></Selecto>

            <div className="elements selecto-area">
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
