import * as React from "react";
import MoveableManager from "../MoveableManager";
import { prefix, getControlTransform } from "../utils";

export default {
    name: "origin",
    render(moveable: MoveableManager) {
        if (!moveable.props.origin) {
            return null;
        }
        const { beforeOrigin } = moveable.state;

        return [
            // <div className={prefix("control", "origin")} style={getControlTransform(origin)} key="origin"></div>,
            <div className={prefix("control", "origin")}
                style={getControlTransform(beforeOrigin)} key="beforeOrigin"></div>,
        ];
    },
};
