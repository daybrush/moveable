import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <p className="description">
                * You can persist by `moveable.getRect()` method.
            </p>
            <div className="target target1" style={{
                transform: "translate(57.4837px, 16.3011px) rotate(30.5213deg)",
            }}>No Target1</div>
            <div className="target target2" style={{
                transform: "translate(22.3858px, 104.945px) rotate(30.5213deg)",
            }}>No Target2</div>
            <div className="target target3" style={{
                transform: "translate(-16.8514px, 28.7599px) rotate(30.5213deg)",
            }}>No Target3</div>
            <Moveable
                // target={".target"}
                draggable={true}
                resizable={true}
                rotatable={true}
                origin={true}
                individualGroupable={true}
                persistData={{
                    left: 92.99700062437337,
                    top: 117.83604282479718,
                    pos1: [
                        209.80457062437335,
                        117.83604282479718,
                    ],
                    pos2: [
                        451.00777062437334,
                        260.03656282479716,
                    ],
                    pos3: [
                        92.99700062437337,
                        315.96724282479715,
                    ],
                    pos4: [
                        334.20020062437334,
                        458.1677628247972,
                    ],
                    offsetWidth: 280,
                    offsetHeight: 230,
                    origin: [
                        272.00238562437335,
                        288.0019028247972,
                    ],
                    children: [
                        {
                            left: 159.01875,
                            top: 117.83615,
                            pos1: [
                                209.80455,
                                117.83615,
                            ],
                            pos2: [
                                295.94865,
                                168.62195,
                            ],
                            pos3: [
                                159.01875,
                                203.98025,
                            ],
                            pos4: [
                                245.16285,
                                254.76605,
                            ],
                            offsetWidth: 100,
                            offsetHeight: 100,
                            origin: [
                                227.4837,
                                186.30110000000002,
                            ],
                        },
                        {
                            left: 303.92085000000003,
                            top: 226.48005,
                            pos1: [
                                354.70665,
                                226.48005,
                            ],
                            pos2: [
                                440.85075,
                                277.26585,
                            ],
                            pos3: [
                                303.92085000000003,
                                312.62415,
                            ],
                            pos4: [
                                390.06495,
                                363.40995,
                            ],
                            offsetWidth: 100,
                            offsetHeight: 100,
                            origin: [
                                372.3858,
                                294.945,
                            ],
                        },
                        {
                            left: 144.68365,
                            top: 260.29495,
                            pos1: [
                                195.46945,
                                260.29495,
                            ],
                            pos2: [
                                281.61355,
                                311.08074999999997,
                            ],
                            pos3: [
                                144.68365,
                                346.43904999999995,
                            ],
                            pos4: [
                                230.82774999999998,
                                397.22484999999995,
                            ],
                            offsetWidth: 100,
                            offsetHeight: 100,
                            origin: [
                                213.1486,
                                328.75989999999996,
                            ],
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
            />
        </div>
    );
}
