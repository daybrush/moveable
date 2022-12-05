import {
    MoveableManagerInterface, MoveableGroupInterface,
    ClickableProps, OnClick, OnClickGroup,
} from "../types";
import { triggerEvent, fillParams } from "../utils";
import { findIndex } from "@daybrush/utils";
import { makeAble } from "./AbleManager";

export default makeAble("clickable", {
    props: {
        clickable: Boolean,
    },
    events: {
        onClick: "click",
        onClickGroup: "clickGroup",
    } as const,
    always: true,
    dragRelation: "weak",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dragStart() {
        return;
    },
    dragControlStart() {
        return;
    },
    dragGroupStart(moveable: MoveableManagerInterface<ClickableProps>, e: any) {
        e.datas.inputTarget = e.inputEvent && e.inputEvent.target;
    },
    dragEnd(moveable: MoveableManagerInterface<ClickableProps>, e: any) {
        const target = moveable.props.target!;
        const inputEvent = e.inputEvent;
        const inputTarget = e.inputTarget;
        const isMoveableElement = moveable.isMoveableElement(inputTarget);
        const containsElement = !isMoveableElement && moveable.controlBox.getElement().contains(inputTarget);

        if (
            !inputEvent || !inputTarget || e.isDrag
            || moveable.isMoveableElement(inputTarget)
            || containsElement
            // External event duplicate target or dragAreaElement
        ) {
            return;
        }
        const containsTarget = target.contains(inputTarget);

        triggerEvent(moveable, "onClick", fillParams<OnClick>(moveable, e, {
            isDouble: e.isDouble,
            inputTarget,
            isTarget: target === inputTarget,
            moveableTarget: moveable.props.target!,
            containsTarget,
        }));
    },
    dragGroupEnd(moveable: MoveableGroupInterface<ClickableProps>, e: any) {
        const inputEvent = e.inputEvent;
        const inputTarget = e.inputTarget;

        if (
            !inputEvent || !inputTarget || e.isDrag
            || moveable.isMoveableElement(inputTarget)
            // External event duplicate target or dragAreaElement
            || e.datas.inputTarget === inputTarget
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

        triggerEvent(moveable, "onClickGroup", fillParams<OnClickGroup>(moveable, e, {
            isDouble: e.isDouble,
            targets,
            inputTarget,
            targetIndex,
            isTarget,
            containsTarget,
            moveableTarget: targets[targetIndex],
        }));
    },
    dragControlEnd(moveable: MoveableManagerInterface<ClickableProps>, e: any) {
        this.dragEnd(moveable, e);
    },
    dragGroupControlEnd(moveable: MoveableManagerInterface<ClickableProps>, e: any) {
        this.dragEnd(moveable, e);
    },
});

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
