
import {
    ScrollableProps, OnScroll, MoveableManagerInterface,
    MoveableGroupInterface, MoveableRefType,
} from "../types";
import { triggerEvent, fillParams, getRefTarget } from "../utils";
import DragScroll from "@scena/dragscroll";

function getDefaultScrollPosition(e: { scrollContainer: HTMLElement, direction: number[] }) {
    const scrollContainer = e.scrollContainer;

    return [
        scrollContainer.scrollLeft,
        scrollContainer.scrollTop,
    ];
}
/**
 * @namespace Moveable.Scrollable
 * @description Whether or not target can be scrolled to the scroll container (default: false)
 */
export default {
    name: "scrollable",
    canPinch: true,
    props: {
        scrollable: Boolean,
        scrollContainer: Object,
        scrollThreshold: Number,
        scrollThrottleTime: Number,
        getScrollPosition: Function,
    } as const,
    events: {
        onScroll: "scroll",
        onScrollGroup: "scrollGroup",
    } as const,
    dragRelation: "strong",
    dragStart(moveable: MoveableManagerInterface<ScrollableProps>, e: any) {
        const props = moveable.props;
        const {
            scrollContainer = moveable.getContainer() as HTMLElement,
        } = props;

        const dragScroll = new DragScroll();
        const scrollContainerElement = getRefTarget<HTMLElement>(scrollContainer, true);

        e.datas.dragScroll = dragScroll;

        const gestoName = e.isControl ? "controlGesto" : "targetGesto";
        const targets = e.targets;

        dragScroll.on("scroll", ({ container, direction }) => {
            const params = fillParams<OnScroll>(moveable, e, {
                scrollContainer: container,
                direction,
            }) as any;

            const eventName = targets ? "onScrollGroup" : "onScroll" as any;
            if (targets) {
                params.targets = targets;
            }
            triggerEvent(moveable, eventName, params);
        }).on("move", ({ offsetX, offsetY, inputEvent }) => {
            moveable[gestoName].scrollBy(offsetX, offsetY, inputEvent.inputEvent, false);
        });
        dragScroll.dragStart(e, {
            container: scrollContainerElement!,
        });
    },
    checkScroll(moveable: MoveableManagerInterface<ScrollableProps>, e: any) {
        const dragScroll = e.datas.dragScroll as DragScroll;

        if (!dragScroll) {
            return;
        }
        const {
            scrollContainer = moveable.getContainer() as MoveableRefType<HTMLElement>,
            scrollThreshold = 0,
            scrollThrottleTime = 0,
            getScrollPosition = getDefaultScrollPosition,
        } = moveable.props;

        dragScroll.drag(e, {
            container: scrollContainer!,
            threshold: scrollThreshold,
            throttleTime: scrollThrottleTime,
            getScrollPosition: (ev: any) => {
                return getScrollPosition({ scrollContainer: ev.container, direction: ev.direction });
            },
        });

        return true;
    },
    drag(moveable: MoveableManagerInterface<ScrollableProps>, e: any) {
        return this.checkScroll(moveable, e);
    },
    dragEnd(moveable: MoveableManagerInterface<ScrollableProps>, e: any) {
        e.datas.dragScroll.dragEnd();
        e.datas.dragScroll = null;
    },
    dragControlStart(moveable: MoveableManagerInterface<ScrollableProps>, e: any) {
        return this.dragStart(moveable, { ...e, isControl: true });
    },
    dragControl(moveable: MoveableManagerInterface<ScrollableProps>, e: any) {
        return this.drag(moveable, e);
    },
    dragControlEnd(moveable: MoveableManagerInterface<ScrollableProps>, e: any) {
        return this.dragEnd(moveable, e);
    },
    dragGroupStart(moveable: MoveableGroupInterface, e: any) {
        return this.dragStart(moveable, { ...e, targets: moveable.props.targets });
    },
    dragGroup(moveable: MoveableGroupInterface, e: any) {
        return this.drag(moveable, { ...e, targets: moveable.props.targets });
    },
    dragGroupEnd(moveable: MoveableGroupInterface, e: any) {
        return this.dragEnd(moveable, { ...e, targets: moveable.props.targets });
    },
    dragGroupControlStart(moveable: MoveableGroupInterface, e: any) {
        return this.dragStart(moveable, { ...e, targets: moveable.props.targets, isControl: true });
    },
    dragGroupContro(moveable: MoveableGroupInterface, e: any) {
        return this.drag(moveable, { ...e, targets: moveable.props.targets });
    },
    dragGroupControEnd(moveable: MoveableGroupInterface, e: any) {
        return this.dragEnd(moveable, { ...e, targets: moveable.props.targets });
    },
};

/**
 * Whether or not target can be scrolled to the scroll container
 * @name Moveable.Scrollable#scrollable
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   scrollable: true,
 *   scrollContainer: document.body,
 *   scrollThreshold: 100,
 *   scrollThrottleTime: 30,
 *   getScrollPosition: ({ scrollContainer }) => ([scrollContainer.scrollLeft, scrollContainer.scrollTop]),
 * });
 *
 * moveable.scrollable = true;
 */

/**
 * The container to which scroll is applied
 * @name Moveable.Scrollable#scrollContainer
 * @default container
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   scrollable: true,
 *   scrollContainer: document.body,
 *   scrollThreshold: 100,
 *   scrollThrottleTime: 30,
 *   getScrollPosition: ({ scrollContainer }) => ([scrollContainer.scrollLeft, scrollContainer.scrollTop]),
 * });
 */
/**
 * Expand the range of the scroll check area.
 * @name Moveable.Scrollable#scrollThreshold
 * @default 0
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   scrollable: true,
 *   scrollContainer: document.body,
 *   scrollThreshold: 100,
 *   scrollThrottleTime: 30,
 *   getScrollPosition: ({ scrollContainer }) => ([scrollContainer.scrollLeft, scrollContainer.scrollTop]),
 * });
 */

/**
 * Time interval that occurs when scrolling occurs when dragging is maintained
 * If set to 0, it does not occur.
 * @name Moveable.Scrollable#scrollThreshold
 * @default 0
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   scrollable: true,
 *   scrollContainer: document.body,
 *   scrollThreshold: 100,
 *   scrollThrottleTime: 30,
 *   getScrollPosition: ({ scrollContainer }) => ([scrollContainer.scrollLeft, scrollContainer.scrollTop]),
 * });
 */

/**
 * Sets a function to get the scroll position.
 * @name Moveable.Scrollable#getScrollPosition
 * @default container's scroll pos array
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   scrollable: true,
 *   scrollContainer: document.body,
 *   scrollThreshold: 100,
 *   scrollThrottleTime: 30,
 *   getScrollPosition: ({ scrollContainer }) => ([scrollContainer.scrollLeft, scrollContainer.scrollTop]),
 * });
 *
 */

/**
 * When the drag cursor leaves the scrollContainer, the `scroll` event occur to scroll.
 * @memberof Moveable.Scrollable
 * @event scroll
 * @param {Moveable.Scrollable.OnScroll} - Parameters for the `scroll` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: document.querySelector(".target"),
 * });
 * moveable.on("scroll", ({ scrollContainer, direction }) => {
 *   scrollContainer.scrollLeft += direction[0] * 10;
 *   scrollContainer.scrollTop += direction[1] * 10;
 * });
 */

/**
 * When the drag cursor leaves the scrollContainer, the `scrollGroup` event occur to scroll in group.
 * @memberof Moveable.Scrollable
 * @event scrollGroup
 * @param {Moveable.Scrollable.OnScrollGroup} - Parameters for the `scrollGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 * });
 * moveable.on("scroll", ({ scrollContainer, direction }) => {
 *   scrollContainer.scrollLeft += direction[0] * 10;
 *   scrollContainer.scrollTop += direction[1] * 10;
 * });
 */
