import MoveableManager from "../MoveableManager";
import { createWarpMatrix, convertMatrixtoCSS } from "@moveable/matrix";
import { ref } from "framework-utils";
import { prefix } from "../utils";
import { Renderer, GroupableProps } from "../types";

export default {
    name: "dragArea",
    render(moveable: MoveableManager<GroupableProps>, React: Renderer): any[] {
        const { target, dragArea, groupable } = moveable.props;

        const { width, height, pos1, pos2, pos3, pos4 } = moveable.state;

        if (groupable) {
            return [
                <div key="area" ref={ref(moveable, "areaElement")} className={prefix("area")} />,
            ];
        }
        if (!target || !dragArea) {
            return [];
        }
        const h = createWarpMatrix(
            [0, 0],
            [width, 0],
            [0, height],
            [width, height],
            pos1,
            pos2,
            pos3,
            pos4,
        );

        if (!h.length) {
            return [];
        }
        return [
            <div key="area" ref={ref(moveable, "areaElement")} className={prefix("area")} style={{
                top: "0px",
                left: "0px",
                width: `${width}px`,
                height: `${height}px`,
                transformOrigin: "0 0",
                transform: `matrix3d(${convertMatrixtoCSS(h).join(",")})`,
            }}/>,
        ];
    },
};
