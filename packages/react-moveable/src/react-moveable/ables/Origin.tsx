import MoveableManager from "../MoveableManager";
import { prefix, getControlTransform } from "../utils";
import { Renderer } from "../types";

export default {
    name: "origin",
    render(moveable: MoveableManager, React: Renderer): any {
        if (!moveable.props.origin) {
            return null;
        }
        const { beforeOrigin, rotation } = moveable.state;

        return [
            <div className={prefix("control", "origin")}
                style={getControlTransform(rotation, beforeOrigin)} key="beforeOrigin"></div>,
        ];
    },
};
