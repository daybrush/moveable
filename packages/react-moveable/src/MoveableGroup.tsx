import MoveableManager from "./MoveableManager";
import { GroupableProps, GroupRect, MoveableTargetGroupsType, RectInfo } from "./types";
import ChildrenDiffer from "@egjs/children-differ";
import { getAbleGesto, getTargetAbleGesto } from "./gesto/getAbleGesto";
import Groupable from "./ables/Groupable";
import { MIN_NUM, MAX_NUM, TINY_NUM } from "./consts";
import {
    getAbsolutePosesByState, equals, unset, rotatePosesInfo,
    convertTransformOriginArray,
    isDeepArrayEquals,
} from "./utils";
import { minus, plus } from "@scena/matrix";
import { getIntersectionPointsByConstants, getMinMaxs } from "overlap-area";
import { find, isArray, throttle } from "@daybrush/utils";
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


function getGroupRect(parentPoses: number[][][], rotation: number): GroupRect {
    let pos1 = [0, 0];
    let pos2 = [0, 0];
    let pos3 = [0, 0];
    let pos4 = [0, 0];
    let width = 0;
    let height = 0;

    if (!parentPoses.length) {
        return {
            pos1,
            pos2,
            pos3,
            pos4,
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0,
            width,
            height,
            rotation,
        };
    }
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

        parentPoses.forEach(poses => {
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
        const minX = getMinPos(parentPoses, 0);
        const minY = getMinPos(parentPoses, 1);
        const maxX = getMaxPos(parentPoses, 0);
        const maxY = getMaxPos(parentPoses, 1);

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
    const { minX, minY, maxX, maxY } = getMinMaxs([pos1, pos2, pos3, pos4]);

    return {
        pos1,
        pos2,
        pos3,
        pos4,
        width,
        height,
        minX,
        minY,
        maxX,
        maxY,
        rotation,
    };
}
type SelfGroup = Array<MoveableManager | null | SelfGroup>;
type CheckedMoveableManager = { finded: boolean; manager: MoveableManager };

function findMoveableGroups(
    moveables: CheckedMoveableManager[],
    childTargetGroups: MoveableTargetGroupsType,
): SelfGroup {
    const groups = childTargetGroups.map(targetGroup => {
        if (isArray(targetGroup)) {
            const childMoveableGroups = findMoveableGroups(moveables, targetGroup);
            const length = childMoveableGroups.length;

            if (length > 1) {
                return childMoveableGroups;
            } else if (length === 1) {
                return childMoveableGroups[0];
            } else {
                return null;
            }
        } else {
            const checked = find(moveables, ({ manager }) => manager.props.target === targetGroup)!;

            if (checked) {
                checked.finded = true;
                return checked.manager;
            }
            return null;
        }
    }).filter(Boolean);

    if (groups.length === 1 && isArray(groups[0])) {
        return groups[0];
    }
    return groups;
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
    public renderGroupRects: GroupRect[] = [];
    private _targetGroups: MoveableTargetGroupsType = [];
    private _hasFirstTargets = false;

    public componentDidMount() {
        super.componentDidMount();
    }
    public checkUpdate() {
        this._isPropTargetChanged = false;
        this.updateAbles();
    }
    public getTargets() {
        return this.props.targets!;
    }
    public updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState = true) {
        const state = this.state;

        if (!this.controlBox || state.isPersisted) {
            return;
        }
        this.moveables.forEach(moveable => {
            moveable.updateRect(type, false, false);
        });

        const props = this.props;
        const moveables = this.moveables;
        const target = state.target! || props.target!;
        const checkeds = moveables.map(moveable => ({ finded: false, manager: moveable }));
        const targetGroups = this.props.targetGroups || [];
        const moveableGroups = findMoveableGroups(
            checkeds,
            targetGroups,
        );

        moveableGroups.push(...checkeds.filter(({ finded }) => !finded).map(({ manager }) => manager));

        const renderGroupRects: GroupRect[] = [];
        const isReset = !isTarget || (type !== "" && props.updateGroup);
        let defaultGroupRotate = props.defaultGroupRotate || 0;

        if (!this._hasFirstTargets) {
            const persistedRoatation = this.props.persistData?.rotation;

            if (persistedRoatation != null) {
                defaultGroupRotate = persistedRoatation;
            }
        }

        function getMoveableGroupRect(group: SelfGroup, parentRotation: number, isRoot?: boolean): GroupRect {
            const posesRotations = group.map(moveable => {
                if (isArray(moveable)) {
                    const rect = getMoveableGroupRect(moveable, parentRotation);
                    const poses = [rect.pos1, rect.pos2, rect.pos3, rect.pos4];

                    renderGroupRects.push(rect);
                    return { poses, rotation: rect.rotation };
                } else {
                    return {
                        poses: getAbsolutePosesByState(moveable!.state),
                        rotation: moveable!.getRotation(),
                    };
                }
            });
            const rotations = posesRotations.map(({ rotation }) => rotation);

            let groupRotation = 0;
            const firstRotation = rotations[0];
            const isSameRotation = rotations.every(nextRotation => {
                return Math.abs(firstRotation - nextRotation) < 0.1;
            });

            if (isReset) {
                groupRotation = isSameRotation ? firstRotation : defaultGroupRotate;
            } else {
                groupRotation = !isRoot && isSameRotation ? firstRotation : parentRotation;
            }
            const groupPoses = posesRotations.map(({ poses }) => poses);
            const groupRect = getGroupRect(
                groupPoses,
                groupRotation,
            );

            return groupRect;
        }
        const rootGroupRect = getMoveableGroupRect(moveableGroups, this.rotation, true);

        if (isReset) {
            // reset rotataion
            this.rotation = rootGroupRect.rotation;
            this.transformOrigin = props.defaultGroupOrigin || "50% 50%";
            this.scale = [1, 1];
        }


        this._targetGroups = targetGroups;
        this.renderGroupRects = renderGroupRects;
        const transformOrigin = this.transformOrigin;
        const rotation = this.rotation;
        const scale = this.scale;
        const { width, height, minX, minY } = rootGroupRect;
        const posesInfo = rotatePosesInfo(
            [
                [0, 0],
                [width, 0],
                [0, height],
                [width, height],
            ],
            convertTransformOriginArray(transformOrigin, width, height),
            this.rotation / 180 * Math.PI,
        );

        const { minX: deltaX, minY: deltaY } = getMinMaxs(posesInfo.result);
        const rotateScale = ` rotate(${rotation}deg)`
            + ` scale(${scale[0] >= 0 ? 1 : -1}, ${scale[1] >= 0 ? 1 : -1})`;
        const transform = `translate(${-deltaX}px, ${-deltaY}px)${rotateScale}`;

        this.controlBox.getElement().style.transform
            = `translate3d(${minX}px, ${minY}px, ${this.props.translateZ || 0})`;

        target.style.cssText += `left:0px;top:0px;`
            + `transform-origin:${transformOrigin};`
            + `width:${width}px;height:${height}px;`
            + `transform: ${transform}`;
        state.width = width;
        state.height = height;

        const container = this.getContainer();
        const info = getMoveableTargetInfo(
            this.controlBox.getElement(),
            target,
            this.controlBox.getElement(),
            this.getContainer(),
            this._rootContainer || container,
            [],
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
        const direction = scale[0] * scale[1] > 0 ? 1 : -1;

        info.pos1 = minus(pos1, delta);
        info.pos2 = minus(pos2, delta);
        info.pos3 = minus(pos3, delta);
        info.pos4 = minus(pos4, delta);
        // info.left = info.left + delta[0];
        // info.top = info.top + delta[1];
        info.left = minX - info.left! + delta[0];
        info.top = minY - info.top! + delta[1];
        info.origin = minus(plus(pos, info.origin!), delta);
        info.beforeOrigin = minus(plus(pos, info.beforeOrigin!), delta);
        info.originalBeforeOrigin = plus(pos, info.originalBeforeOrigin!);
        info.transformOrigin = minus(plus(pos, info.transformOrigin!), delta);
        target.style.transform
            = `translate(${-deltaX - delta[0]}px, ${-deltaY - delta[1]}px)`
            + rotateScale;
        this.updateState(
            {
                ...info,
                posDelta: delta,
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
        const targets = props.targets!;
        const { added, changed, removed } = this.differ.update(targets);
        const isTargetChanged = added.length || removed.length;

        if (
            isContainerChanged
            || isTargetChanged
            || changed.length
            || targets.length && !isDeepArrayEquals(this._targetGroups, props.targetGroups || [])
        ) {
            this.updateRect();
            this._hasFirstTargets = true;
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
