import {
    MoveableManagerInterface, MoveableGroupInterface,
    ClickableProps, OnClick, OnClickGroup
} from "../types";
import { triggerEvent, fillParams } from "../utils";
import { findIndex } from "@daybrush/utils";

export default {
    name: "Clickable",
    props: {} as const,
    events: {
        onClick: "click",
        onClickGroup: "clickGroup",
    } as const,
    always: true,
    dragStart() {},
    dragGroupStart() {},
    dragEnd(moveable: MoveableManagerInterface<ClickableProps>, e: any) {
        const target = moveable.state.target!;
        const inputEvent = e.inputEvent;
        const inputTarget = e.inputTarget;

        if (
            !inputEvent || !inputTarget || e.isDrag
            || moveable.isMoveableElement(inputTarget)
        ) {
            return;
        }
        const containsTarget = target.contains(inputTarget);

        triggerEvent<ClickableProps>(moveable, "onClick", fillParams<OnClick>(moveable, e, {
            isDouble: e.isDouble,
            inputTarget,
            isTarget: target === inputTarget,
            containsTarget,
        }));
    },
    dragGroupEnd(moveable: MoveableGroupInterface<ClickableProps>, e: any) {
        const inputEvent = e.inputEvent;
        const inputTarget = e.inputTarget;

        if (
            !inputEvent || !inputTarget || e.isDrag
            || moveable.isMoveableElement(inputTarget)
        ) {
            return;
        }
        const targets = moveable.props.targets!;
        let targetIndex = targets.indexOf(inputTarget);
        const isTarget = targetIndex > -1;
        let containsTarget = false;

        if (targetIndex === -1) {
            targetIndex = findIndex(targets, parentTarget => parentTarget.contains(inputTarget));
            containsTarget = targetIndex > -1;
        }

        triggerEvent<ClickableProps>(moveable, "onClickGroup", fillParams<OnClickGroup>(moveable, e, {
            isDouble: e.isDouble,
            targets,
            inputTarget,
            targetIndex,
            isTarget,
            containsTarget,
        }));
    },
} as const;

/**
 * When you click on the element, the `click` event is called.
 * @memberof Moveable
 * @event click
 * @param {Moveable.OnClick} - Parameters for the `click` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: document.querySelector(".target"),
 * });
 * moveable.on("click", ({ hasTarget, containsTarget, targetIndex }) => {
 *     // If you click on an element other than the target and not included in the target, index is -1.
 *     console.log("onClickGroup", target, hasTarget, containsTarget, targetIndex);
 * });
 */

/**
 * When you click on the element inside the group, the `clickGroup` event is called.
 * @memberof Moveable
 * @event clickGroup
 * @param {Moveable.OnClickGroup} - Parameters for the `clickGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 * });
 * moveable.on("clickGroup", ({ inputTarget, isTarget, containsTarget, targetIndex }) => {
 *     // If you click on an element other than the target and not included in the target, index is -1.
 *     console.log("onClickGroup", inputTarget, isTarget, containsTarget, targetIndex);
 * });
 */
