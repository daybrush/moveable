import * as React from "react";
import Moveable, { DraggableRequestParam } from "@/react-moveable";
import Selecto from "react-selecto";

export default function App() {
    const moveableRef = React.useRef<Moveable>(null);
    const [targets, setTargets] = React.useState<Array<HTMLElement | SVGElement>>([]);
    return (
        <div className="root">
            <div className="container">
                <button onClick={() => {
                    const rect = moveableRef.current!.getRect();
                    const moveables = moveableRef.current!.getMoveables();

                    if (moveables.length <= 1) {
                        return;
                    }
                    moveables.forEach(child => {
                        child.request<DraggableRequestParam>("draggable", {
                            y: rect.top,
                        }, true);
                    });

                    moveableRef.current?.updateRect();
                }}>Align Top</button>&nbsp;
                <button onClick={() => {
                    const rect = moveableRef.current!.getRect();
                    const moveables = moveableRef.current!.getMoveables();

                    if (moveables.length <= 1) {
                        return;
                    }
                    moveables.forEach(child => {
                        child.request<DraggableRequestParam>("draggable", {
                            y: rect.top + rect.height,
                        }, true);
                    });

                    moveableRef.current?.updateRect();
                }}>Align Bottom</button>&nbsp;
                <button onClick={() => {
                    const rect = moveableRef.current!.getRect();
                    const moveables = moveableRef.current!.getMoveables();

                    if (moveables.length <= 1) {
                        return;
                    }
                    moveables.forEach(child => {
                        child.request<DraggableRequestParam>("draggable", {
                            x: rect.left,
                        }, true);
                    });

                    moveableRef.current?.updateRect();
                }}>Align Left</button>&nbsp;
                <button onClick={() => {
                    const rect = moveableRef.current!.getRect();
                    const moveables = moveableRef.current!.getMoveables();

                    if (moveables.length <= 1) {
                        return;
                    }
                    moveables.forEach(child => {
                        child.request<DraggableRequestParam>("draggable", {
                            y: rect.left + rect.width,
                        }, true);
                    });

                    moveableRef.current?.updateRect();
                }}>Align Right</button>&nbsp;
                <button onClick={() => {
                    const rect = moveableRef.current!.getRect();
                    const moveables = moveableRef.current!.getMoveables();

                    if (moveables.length <= 1) {
                        return;
                    }
                    moveables.forEach((child, i) => {
                        child.request<DraggableRequestParam>("draggable", {
                            y: rect.top + rect.height / 2 - rect.children![i].height / 2,
                        }, true);
                    });

                    moveableRef.current?.updateRect();
                }}>Align Vertical Center</button>&nbsp;
                <button onClick={() => {
                    const rect = moveableRef.current!.getRect();
                    const moveables = moveableRef.current!.getMoveables();

                    if (moveables.length <= 1) {
                        return;
                    }
                    moveables.forEach((child, i) => {
                        child.request<DraggableRequestParam>("draggable", {
                            x: rect.left + rect.width / 2 - rect.children![i].width / 2,
                        }, true);
                    });

                    moveableRef.current?.updateRect();
                }}>Align Horizontal Center</button>&nbsp;
                <button onClick={() => {
                    const groupRect = moveableRef.current!.getRect();
                    const moveables = moveableRef.current!.getMoveables();
                    let top = groupRect.top;

                    if (moveables.length <= 1) {
                        return;
                    }
                    const gap = (groupRect.height - groupRect.children!.reduce((prev, cur) => {
                        return prev + cur.height;
                    }, 0)) / (moveables.length - 1);

                    moveables.sort((a, b) => {
                        return a.state.top - b.state.top;
                    });
                    moveables.forEach(child => {
                        const rect = child.getRect();

                        child.request<DraggableRequestParam>("draggable", {
                            y: top,
                        }, true);

                        top += rect.height + gap;
                    });


                    moveableRef.current?.updateRect();
                }}>Arrange Vertical Spacing</button>&nbsp;
                <button onClick={() => {
                    const groupRect = moveableRef.current!.getRect();
                    const moveables = moveableRef.current!.getMoveables();
                    let left = groupRect.left;

                    if (moveables.length <= 1) {
                        return;
                    }
                    const gap = (groupRect.width - groupRect.children!.reduce((prev, cur) => {
                        return prev + cur.width;
                    }, 0)) / (moveables.length - 1);

                    moveables.sort((a, b) => {
                        return a.state.left - b.state.left;
                    });
                    moveables.forEach(child => {
                        const rect = child.getRect();

                        child.request<DraggableRequestParam>("draggable", {
                            x: left,
                        }, true);

                        left += rect.width + gap;
                    });

                    moveableRef.current?.updateRect();
                }}>Arrange Horizontal Spacing</button>&nbsp;
                <div className="target target1" style={{
                    left: "50px",
                    top: "150px",
                }}>Target1</div>
                <div className="target target2" style={{
                    left: "250px",
                    top: "250px",
                }}>Target2</div>
                <div className="target target3" style={{
                    left: "400px",
                    top: "300px",
                }}>Target3</div>
                <Moveable
                    ref={moveableRef}
                    target={targets}
                    draggable={true}
                    resizable={true}
                    snappable={true}
                    snapGridWidth={50}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                    onRenderGroup={e => {
                        e.events.forEach(ev => {
                            ev.target.style.cssText += ev.cssText;
                        });
                    }}
                />
                <Selecto
                    dragContainer={window}
                    selectableTargets={[".target"]}
                    hitRate={0}
                    selectByClick={true}
                    selectFromInside={true}
                    toggleContinueSelect={["shift"]}
                    ratio={0}
                    onDragStart={e => {
                        const moveable = moveableRef.current!;
                        const target = e.inputEvent.target;
                        if (
                            target.tagName === "BUTTON"
                            || moveable.isMoveableElement(target)
                            || targets.some(t => t === target || t.contains(target))
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
                        setTargets(e.selected);
                    }}
                ></Selecto>
            </div>
        </div>
    );
}
