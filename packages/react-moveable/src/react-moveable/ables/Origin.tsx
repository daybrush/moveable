import MoveableManager from "../MoveableManager";
import { prefix, getControlTransform } from "../utils";
import { Renderer, OriginProps } from "../types";

export default {
    name: "origin",
    props: {
        origin: Boolean,
    },
    render(moveable: MoveableManager<OriginProps>, React: Renderer): any {
        const { beforeOrigin, rotation } = moveable.state;

        return [
            <div className={prefix("control", "origin")}
                style={getControlTransform(rotation, beforeOrigin)} key="beforeOrigin"></div>,
        ];
    },
};
