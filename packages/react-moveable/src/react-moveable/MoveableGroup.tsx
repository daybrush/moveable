import MoveableManager from "./MoveableManager";
import { GroupableProps, RectInfo } from "./types";
import ChildrenDiffer from "@egjs/children-differ";
import { getAbleGesto, getTargetAbleGesto } from "./gesto/getAbleGesto";
import Groupable from "./ables/Groupable";
import { MIN_NUM, MAX_NUM, TINY_NUM } from "./consts";
import { getAbsolutePosesByState, equals, unset } from "./utils";
import { minus, plus } from "@scena/matrix";
import { getIntersectionPointsByConstants, getMinMaxs } from "overlap-area";
import { throttle } from "@daybrush/utils";
import { getMoveableTargetInfo } from "./utils/getMoveableTargetInfo";
import { solveC, solveConstantsDistance } from "./Snappable/utils";

function getMaxPos(poses: number[][][], index: number) {
    return Math.max(...poses.map(([pos1, pos2, pos3, pos4]) => {
        return Math.max(pos1[index], pos2[index], pos3[index], pos4[index]);
    }));
}
function getMinPos(poses: number[][][], index: number) {
    return Math.min(...poses.map(([pos1, pos2, pos3, pos4]) => {
        return Math.min(pos1[index], pos2[index], pos3[index], pos4[index]);
    }));
}

function getGroupRect(moveables: MoveableManager[], rotation: number) {
    let pos1 = [0, 0];
    let pos2 = [0, 0];
    let pos3 = [0, 0];
    let pos4 = [0, 0];
    let width = 0;
    let height = 0;

    if (!moveables.length) {
        return {
            pos1,
            pos2,
            pos3,
            pos4,
            minX: 0,
            minY: 0,
            width,
            height,
        };
    }

    const moveablePoses = moveables.map(({ state }) => getAbsolutePosesByState(state));
    const fixedRotation = throttle(rotation, TINY_NUM);

    if (fixedRotation % 90) {
        const rad = fixedRotation / 180 * Math.PI;
        const a1 = Math.tan(rad);
        const a2 = -1 / a1;
        // ax = y  // -ax + y = 0 // 0 => 1
        // -ax = y // ax + y = 0  // 0 => 3
        const a1MinMax = [MAX_NUM, MIN_NUM];
        const a1MinMaxPos = [[0, 0], [0, 0]];
        const a2MinMax = [MAX_NUM, MIN_NUM];
        const a2MinMaxPos = [[0, 0], [0, 0]];

        moveablePoses.forEach(poses => {
            poses.forEach(pos => {

                // const b1 = pos[1] - a1 * pos[0];
                // const b2 = pos[1] - a2 * pos[0];

                const a1Dist = solveConstantsDistance([-a1, 1, 0], pos);
                const a2Dist = solveConstantsDistance([-a2, 1, 0], pos);

                if (a1MinMax[0] > a1Dist) {
                    a1MinMaxPos[0] = pos;
                    a1MinMax[0] = a1Dist;
                }
                if (a1MinMax[1] < a1Dist) {
                    a1MinMaxPos[1] = pos;
                    a1MinMax[1] = a1Dist;
                }
                if (a2MinMax[0] > a2Dist) {
                    a2MinMaxPos[0] = pos;
                    a2MinMax[0] = a2Dist;
                }
                if (a2MinMax[1] < a2Dist) {
                    a2MinMaxPos[1] = pos;
                    a2MinMax[1] = a2Dist;
                }
            });
        });

        const [a1MinPos, a1MaxPos] = a1MinMaxPos;
        const [a2MinPos, a2MaxPos] = a2MinMaxPos;

        const minHorizontalLine = [-a1, 1, solveC([-a1, 1], a1MinPos)];
        const maxHorizontalLine = [-a1, 1, solveC([-a1, 1], a1MaxPos)];

        const minVerticalLine = [-a2, 1, solveC([-a2, 1], a2MinPos)];
        const maxVerticalLine = [-a2, 1, solveC([-a2, 1], a2MaxPos)];

        [pos1, pos2, pos3, pos4] = [
            [minHorizontalLine, minVerticalLine],
            [minHorizontalLine, maxVerticalLine],
            [maxHorizontalLine, minVerticalLine],
            [maxHorizontalLine, maxVerticalLine],
        ].map(([line1, line2]) => getIntersectionPointsByConstants(line1, line2)[0]);

        width = a2MinMax[1] - a2MinMax[0];
        height = a1MinMax[1] - a1MinMax[0];
    } else {
        const minX = getMinPos(moveablePoses, 0);
        const minY = getMinPos(moveablePoses, 1);
        const maxX = getMaxPos(moveablePoses, 0);
        const maxY = getMaxPos(moveablePoses, 1);

        pos1 = [minX, minY];
        pos2 = [maxX, minY];
        pos3 = [minX, maxY];
        pos4 = [maxX, maxY];
        width = maxX - minX;
        height = maxY - minY;
        if (fixedRotation % 180) {
            // 0
            // 1 2
            // 3 4
            // 90
            // 3 1
            // 4 2
            // 180
            // 4 3
            // 2 1
            // 270
            // 2 4
            // 1 3
            // 1, 2, 3,4 = 3 1 4 2
            const changedX = [pos3, pos1, pos4, pos2];

            [pos1, pos2, pos3, pos4] = changedX;
            width = maxY - minY;
            height = maxX - minX;
        }

    }
    if (fixedRotation % 360 > 180) {
        // 1 2   4 3
        // 3 4   2 1
        const changedX = [pos4, pos3, pos2, pos1];

        [pos1, pos2, pos3, pos4] = changedX;
    }

    return {
        pos1,
        pos2,
        pos3,
        pos4,
        width,
        height,
        minX: Math.min(pos1[0], pos2[0], pos3[0], pos4[0]),
        minY: Math.min(pos1[1], pos2[1], pos3[1], pos4[1]),
    };
}
/**
 * @namespace Moveable.Group
 * @description You can make targets moveable.
 */
class MoveableGroup extends MoveableManager<GroupableProps> {
    public static defaultProps = {
        ...MoveableManager.defaultProps,
        transformOrigin: ["50%", "50%"],
        groupable: true,
        dragArea: true,
        keepRatio: true,
        targets: [],
        defaultGroupRotate: 0,
        defaultGroupOrigin: "50% 50%",
    };
    public differ: ChildrenDiffer<HTMLElement | SVGElement> = new ChildrenDiffer();
    public moveables: MoveableManager[] = [];
    public transformOrigin = "50% 50%";

    public checkUpdate() {
        this._isPropTargetChanged = false;
        this.updateAbles();
    }

    public updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState = true) {
        if (!this.controlBox) {
            return;
        }
        this.moveables.forEach(moveable => {
            moveable.updateRect(type, false, false);
        });

        const state = this.state;
        const props = this.props;
        const moveables = this.moveables;
        const target = state.target! || props.target!;

        const firstRotation = moveables[0].getRotation();
        const isSameRotation = moveables.every(moveable => {
            return Math.abs(firstRotation - moveable.getRotation()) < 0.1;
        });

        if (!isTarget || (type !== "" && props.updateGroup)) {
            // reset rotataion
            this.rotation = isSameRotation ? firstRotation : props.defaultGroupRotate!;
            this.transformOrigin = props.defaultGroupOrigin || "50% 50%";
            this.scale = [1, 1];

        }
        const rotation = this.rotation;
        const scale = this.scale;
        const { width, height, minX, minY } = getGroupRect(moveables, rotation);

        // tslint:disable-next-line: max-line-length
        const transform = `rotate(${rotation}deg) scale(${scale[0] >= 0 ? 1 : -1}, ${scale[1] >= 0 ? 1 : -1})`;
        target.style.cssText += `left:0px;top:0px; transform-origin: ${this.transformOrigin}; width:${width}px; height:${height}px;`
            + `transform:${transform}`;
        state.width = width;
        state.height = height;

        const container = this.getContainer();
        const info = getMoveableTargetInfo(
            this.controlBox.getElement(),
            target,
            this.controlBox.getElement(),
            this.getContainer(),
            this.props.rootContainer || container,
            // state,
        );
        const pos = [info.left!, info.top!];
        const [
            pos1,
            pos2,
            pos3,
            pos4,
        ] = getAbsolutePosesByState(info); // info.left + info.pos(1 ~ 4)

        const minPos = getMinMaxs([pos1, pos2, pos3, pos4]);
        const delta = [minPos.minX, minPos.minY];
        info.pos1 = minus(pos1, delta);
        info.pos2 = minus(pos2, delta);
        info.pos3 = minus(pos3, delta);
        info.pos4 = minus(pos4, delta);
        info.left = minX - info.left! + delta[0];
        info.top = minY - info.top! + delta[1];
        info.origin = minus(plus(pos, info.origin!), delta);
        info.beforeOrigin = minus(plus(pos, info.beforeOrigin!), delta);
        info.originalBeforeOrigin = plus(pos, info.originalBeforeOrigin!);
        // info.transformOrigin = minus(plus(pos, info.transformOrigin!), delta);

        const clientRect = info.targetClientRect!;
        const direction = scale[0] * scale[1] > 0 ? 1 : -1;

        clientRect.top += info.top - state.top;
        clientRect.left += info.left - state.left;

        target.style.transform = `translate(${-delta[0]}px, ${-delta[1]}px) ${transform}`;

        this.updateState(
            {
                ...info,
                direction,
                beforeDirection: direction,
            },
            isSetState,
        );
    }
    public getRect(): RectInfo {
        return {
            ...super.getRect(),
            children: this.moveables.map(child => child.getRect()),
        };
    }
    public triggerEvent(name: string, e: any, isManager?: boolean): any {
        if (isManager || name.indexOf("Group") > -1) {
            return super.triggerEvent(name as any, e);
        } else {
            this._emitter.trigger(name, e);
        }
    }
    protected updateAbles() {
        super.updateAbles([...this.props.ables!, Groupable], "Group");
    }
    protected _updateTargets() {
        super._updateTargets();
        this._prevTarget = this.props.dragTarget || this.areaElement;
    }
    protected _updateEvents() {
        const state = this.state;
        const props = this.props;

        const prevTarget = this._prevTarget;
        const nextTarget = props.dragTarget || this.areaElement;

        if (prevTarget !== nextTarget) {
            unset(this, "targetGesto");
            unset(this, "controlGesto");
            state.target = null;
        }
        if (!state.target) {
            state.target = this.areaElement;
            this.controlBox.getElement().style.display = "block";
        }
        if (state.target) {
            if (!this.targetGesto) {
                this.targetGesto = getTargetAbleGesto(this, nextTarget, "Group");
            }
            if (!this.controlGesto) {
                this.controlGesto = getAbleGesto(this, this.controlBox.getElement(), "controlAbles", "GroupControl");
            }
        }
        const isContainerChanged = !equals(state.container, props.container);

        if (isContainerChanged) {
            state.container = props.container;
        }
        const { added, changed, removed } = this.differ.update(props.targets!);

        const isTargetChanged = added.length || removed.length;

        if (isContainerChanged || isTargetChanged || changed.length) {
            this.updateRect();
        }
        this._isPropTargetChanged = !!isTargetChanged;
    }
    protected _updateObserver() { }
}

/**
 * Sets the initial rotation of the group.
 * @name Moveable.Group#defaultGroupRotate
 * @default 0
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   target: [].slice.call(document.querySelectorAll(".target")),
 *   defaultGroupRotate: 0,
 * });
 *
 * moveable.defaultGroupRotate = 40;
 */

/**
 * Sets the initial origin of the group.
 * @name Moveable.Group#defaultGroupOrigin
 * @default 0
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   target: [].slice.call(document.querySelectorAll(".target")),
 *   defaultGroupOrigin: "50% 50%",
 * });
 *
 * moveable.defaultGroupOrigin = "20% 40%";
 */


/**
 * Whether to hide the line in child moveable for group corresponding to the rect of the target.
 * @name Moveable.Group#hideChildMoveableDefaultLines
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   target: [].slice.call(document.querySelectorAll(".target")),
 *   hideChildMoveableDefaultLines: false,
 * });
 *
 * moveable.hideChildMoveableDefaultLines = true;
 */
export default MoveableGroup;
