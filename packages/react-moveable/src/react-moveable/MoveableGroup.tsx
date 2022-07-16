import MoveableManager from "./MoveableManager";
import { GroupableProps, RectInfo } from "./types";
import ChildrenDiffer from "@egjs/children-differ";
import { getAbleGesto, getTargetAbleGesto } from "./gesto/getAbleGesto";
import Groupable from "./ables/Groupable";
import { MIN_NUM, MAX_NUM, TINY_NUM } from "./consts";
import { getTargetInfo, getAbsolutePosesByState, equals, unset } from "./utils";
import { minus, plus, rotate } from "@scena/matrix";
import { getMinMaxs } from "overlap-area";
import { throttle } from "@daybrush/utils";

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
    if (!moveables.length) {
        return [0, 0, 0, 0];
    }

    const moveablePoses = moveables.map(({ state }) => getAbsolutePosesByState(state));
    let minX = MAX_NUM;
    let minY = MAX_NUM;
    let groupWidth = 0;
    let groupHeight = 0;
    const fixedRotation = throttle(rotation, TINY_NUM);

    if (fixedRotation % 90) {
        const rad = fixedRotation / 180 * Math.PI;
        const a1 = Math.tan(rad);
        const a2 = -1 / a1;
        const b1MinMax = [MIN_NUM, MAX_NUM];
        const b2MinMax = [MIN_NUM, MAX_NUM];

        moveablePoses.forEach(poses => {
            poses.forEach(pos => {
                // ax + b = y
                // b = y - ax
                const b1 = pos[1] - a1 * pos[0];
                const b2 = pos[1] - a2 * pos[0];

                b1MinMax[0] = Math.max(b1MinMax[0], b1);
                b1MinMax[1] = Math.min(b1MinMax[1], b1);
                b2MinMax[0] = Math.max(b2MinMax[0], b2);
                b2MinMax[1] = Math.min(b2MinMax[1], b2);
            });
        });

        b1MinMax.forEach(b1 => {
            // a1x + b1 = a2x + b2
            b2MinMax.forEach(b2 => {
                // (a1 - a2)x = b2 - b1
                const x = (b2 - b1) / (a1 - a2);
                const y = a1 * x + b1;

                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
            });
        });
        const rotatePoses = moveablePoses.map(([pos1, pos2, pos3, pos4]) => {
            return [
                rotate(pos1, -rad),
                rotate(pos2, -rad),
                rotate(pos3, -rad),
                rotate(pos4, -rad),
            ];
        });

        groupWidth = getMaxPos(rotatePoses, 0) - getMinPos(rotatePoses, 0);
        groupHeight = getMaxPos(rotatePoses, 1) - getMinPos(rotatePoses, 1);
    } else {
        minX = getMinPos(moveablePoses, 0);
        minY = getMinPos(moveablePoses, 1);
        groupWidth = getMaxPos(moveablePoses, 0) - minX;
        groupHeight = getMaxPos(moveablePoses, 1) - minY;

        if (fixedRotation % 180) {
            const changedWidth = groupWidth;

            groupWidth = groupHeight;
            groupHeight = changedWidth;
        }
    }
    return [minX, minY, groupWidth, groupHeight];
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
        const target = state.target! || props.target!;

        if (!isTarget || (type !== "" && props.updateGroup)) {
            // reset rotataion
            this.rotation = props.defaultGroupRotate!;
            this.transformOrigin = props.defaultGroupOrigin || "50% 50%";
            this.scale = [1, 1];

        }
        const rotation = this.rotation;
        const scale = this.scale;
        const [left, top, width, height] = getGroupRect(this.moveables, rotation);

        // tslint:disable-next-line: max-line-length
        const transform = `rotate(${rotation}deg) scale(${scale[0] >= 0 ? 1 : -1}, ${scale[1] >= 0 ? 1 : -1})`;
        target.style.cssText += `left:0px;top:0px; transform-origin: ${this.transformOrigin}; width:${width}px; height:${height}px;`
            + `transform:${transform}`;
        state.width = width;
        state.height = height;

        const container = this.getContainer();
        const info = getTargetInfo(
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
        info.left = left - info.left! + delta[0];
        info.top = top - info.top! + delta[1];
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

        if (isContainerChanged || added.length || changed.length || removed.length) {
            this.updateRect();
        }
    }
    protected _updateObserver() {}
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
