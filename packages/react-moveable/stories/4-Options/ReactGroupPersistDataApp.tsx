import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <p className="description">
                * You can persist by `moveable.getRect()` method.
            </p>
            <div className="target target1" style={{
                transform: "translate(57.4837px, 16.3011px) rotate(10.5213deg)",
            }}>No Target1</div>
            <div className="target target2" style={{
                transform: "translate(22.3858px, 104.945px) rotate(30.5213deg)",
            }}>No Target2</div>
            <div className="target target3" style={{
                transform: "translate(-16.8514px, 28.7599px) rotate(30.5213deg)",
            }}>No Target3</div>
            <Moveable
                target={".target"}
                draggable={true}
                resizable={true}
                rotatable={true}
                origin={true}
                persistData={{
                    "width": 391.66543415599995,
                    "height": 383.962796948,
                    "left": 62.228131762906024,
                    "top": 90.31465753146728,
                    "pos1": [
                        219.08575903890602,
                        90.31465753146728,
                    ],
                    "pos2": [
                        453.89356591890595,
                        287.34203529146725,
                    ],
                    "pos3": [
                        62.228131762906024,
                        277.25007671946724,
                    ],
                    "pos4": [
                        297.035938642906,
                        474.2774544794673,
                    ],
                    "offsetWidth": 306.52,
                    "offsetHeight": 244.027,
                    "beforeOrigin": [
                        258.060280934906,
                        282.2936213634673,
                    ],
                    "origin": [
                        258.060280934906,
                        282.2936213634673,
                    ],
                    "transformOrigin": [
                        153.258,
                        122.012,
                    ],
                    "rotation": 40.00003345093183,
                    "children": [
                        {
                            "width": 116.5788,
                            "height": 116.5788,
                            "left": 169.1943,
                            "top": 128.01170000000002,
                            "pos1": [
                                187.4544,
                                128.01170000000002,
                            ],
                            "pos2": [
                                285.7731,
                                146.2718,
                            ],
                            "pos3": [
                                169.1943,
                                226.33040000000003,
                            ],
                            "pos4": [
                                267.51300000000003,
                                244.59050000000002,
                            ],
                            "offsetWidth": 100,
                            "offsetHeight": 100,
                            "beforeOrigin": [
                                227.4837,
                                186.30110000000002,
                            ],
                            "origin": [
                                227.4837,
                                186.30110000000002,
                            ],
                            "transformOrigin": [
                                50,
                                50,
                            ],
                            "rotation": 10.52129854976897,
                        },
                        {
                            "width": 136.92990000000003,
                            "height": 136.92989999999998,
                            "left": 303.92085,
                            "top": 226.48005,
                            "pos1": [
                                354.70675,
                                226.48005,
                            ],
                            "pos2": [
                                440.85075,
                                277.26595,
                            ],
                            "pos3": [
                                303.92085,
                                312.62405,
                            ],
                            "pos4": [
                                390.06485,
                                363.40995,
                            ],
                            "offsetWidth": 100,
                            "offsetHeight": 100,
                            "beforeOrigin": [
                                372.3858,
                                294.945,
                            ],
                            "origin": [
                                372.3858,
                                294.945,
                            ],
                            "transformOrigin": [
                                50,
                                50,
                            ],
                            "rotation": 30.521329871109174,
                        },
                        {
                            "width": 136.92990000000003,
                            "height": 136.92989999999998,
                            "left": 144.68365,
                            "top": 260.29495,
                            "pos1": [
                                195.46955,
                                260.29495,
                            ],
                            "pos2": [
                                281.61355000000003,
                                311.08084999999994,
                            ],
                            "pos3": [
                                144.68365,
                                346.43895,
                            ],
                            "pos4": [
                                230.82765,
                                397.22484999999995,
                            ],
                            "offsetWidth": 100,
                            "offsetHeight": 100,
                            "origin": [
                                213.1486,
                                328.75989999999996,
                            ],
                            "transformOrigin": [
                                50,
                                50,
                            ],
                            "rotation": 30.521329871109167,
                        },
                    ],
                }}
                onRenderGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.cssText += ev.cssText;
                    });
                }}
                onRenderGroupEnd={e => {
                    console.log(JSON.stringify(e.moveable.getRect(), undefined, 4));
                }}
                onChangeTargets={e => {
                    console.log("??", JSON.stringify(e.moveable.getRect(), undefined, 4));
                }}
            />
        </div>
    );
}
