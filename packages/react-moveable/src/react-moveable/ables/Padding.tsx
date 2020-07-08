import { prefix, makeMatrixCSS } from "../utils";
import { Renderer, MoveableManagerInterface } from "../types";
import { createWarpMatrix } from "../matrix";

export default {
    name: "padding",
    props: {
        padding: Object,
    } as const,
    events: {} as const,
    render(moveable: MoveableManagerInterface, React: Renderer): any {
        const props = moveable.props;
        if (props.dragArea) {
            return [];
        }
        const padding = props.padding || {};
        const {
            left = 0,
            top = 0,
            right = 0,
            bottom = 0,
        } = padding;
        const {
            renderPoses,
            pos1,
            pos2,
            pos3,
            pos4,
        } = moveable.state;

        const poses = [pos1, pos2, pos3, pos4];
        const paddingDirections: number[][] = [];

        if (left > 0) {
            paddingDirections.push([0, 2]);
        }
        if (top > 0) {
            paddingDirections.push([0, 1]);
        }
        if (right > 0) {
            paddingDirections.push([1, 3]);
        }
        if (bottom > 0) {
            paddingDirections.push([2, 3]);
        }
        return paddingDirections.map(([dir1, dir2], i) => {
            const paddingPos1 = poses[dir1];
            const paddingPos2 = poses[dir2];
            const paddingPos3 = renderPoses[dir1];
            const paddingPos4 = renderPoses[dir2];

            const h = createWarpMatrix(
                [0, 0],
                [100, 0],
                [0, 100],
                [100, 100],
                paddingPos1,
                paddingPos2,
                paddingPos3,
                paddingPos4,
            );
            if (!h.length) {
                return undefined;
            }
            return (<div key={`padding${i}`} className={prefix("padding")} style={{
                transform: makeMatrixCSS(h, true),
            }}></div>);
        });
    },
};

/**
 * Add padding around the target to increase the drag area. (default: null)
 * @name Moveable#padding
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *  target: document.querySelector(".target"),
 *  padding: { left: 0, top: 0, right: 0, bottom: 0 },
 * });
 * moveable.padding = { left: 10, top: 10, right: 10, bottom: 10 },
 * moveable.updateRect();
 */
