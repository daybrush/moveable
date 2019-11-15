import MoveableManager from "../MoveableManager";
import { ScrollableProps, OnScroll } from "../types";
import { triggerEvent, fillParams } from "../utils";
import MoveableGroup from "../MoveableGroup";

function getDefaultScrollPosition(e: { scrollContainer: HTMLElement, direction: number[] }) {
    const scrollContainer = e.scrollContainer;

    return [
        scrollContainer.scrollLeft,
        scrollContainer.scrollTop,
    ];
}

export default {
    name: "scrollable",
    canPinch: true,
    dragStart(moveable: MoveableManager<ScrollableProps>, e: any) {
        const props = moveable.props;
        const {
            scrollContainer = moveable.getContainer(),
        } = props;

        const scrollClientRect = scrollContainer.getBoundingClientRect();
        const datas = e.datas;
        datas.scrollContainer = scrollContainer;
        datas.scrollRect = {
            left: scrollClientRect.left,
            top: scrollClientRect.top,
            width: scrollClientRect.width,
            height: scrollClientRect.height,
        };

        datas.isScroll = true;
    },
    drag(moveable: MoveableManager<ScrollableProps>, e: any) {
        this.checkScroll(moveable, e);
    },
    dragEnd(moveable: MoveableManager<ScrollableProps>, e: any) {
        e.datas.isScroll = false;
    },
    dragGroupStart(moveable: MoveableGroup, e: any) {
        this.dragStart(moveable, e);
    },
    dragGroup(moveable: MoveableGroup, e: any) {
        this.drag(moveable, {...e, targets: moveable.props.targets });
    },
    dragGroupEnd(moveable: MoveableGroup, e: any) {
        this.dragEnd(moveable, e);
    },
    checkScroll(moveable: MoveableManager<ScrollableProps>, e: any) {
        const {
            datas,
            inputEvent,
            clientX,
            clientY,
            isScroll,
            targets,
        } = e;

        if (!datas.isScroll) {
            return;
        }
        if (!isScroll) {
            datas.prevClientX = clientX;
            datas.prevClientY = clientY;
        }

        const {
            scrollThreshold = 0,
            getScrollPosition = getDefaultScrollPosition,
        } = moveable.props;
        const {
            scrollContainer,
            scrollRect,
        } = datas;

        const direction = [0, 0];

        if (scrollRect.top > clientY - scrollThreshold) {
            direction[1] = -1;
        } else if (scrollRect.top + scrollRect.height < clientY + scrollThreshold) {
            direction[1] = 1;
        }
        if (scrollRect.left > clientX - scrollThreshold) {
            direction[0] = -1;
        } else if (scrollRect.left + scrollRect.width < clientX + scrollThreshold) {
            direction[0] = 1;
        }
        if (!direction[0] && !direction[1]) {
            return;
        }

        const pos = getScrollPosition({ scrollContainer, direction });
        const params = fillParams<OnScroll>(moveable, e, {
            scrollContainer,
            direction,
        }) as any;

        const eventName = targets ? "onScrollGroup" : "onScroll" as any;
        if (targets) {
            params.targets = targets;
        }
        triggerEvent(moveable, eventName, params);

        requestAnimationFrame(() => {
            if (datas.prevClientX !== clientX || datas.prevClientY !== clientY) {
                return;
            }

            const nextPos = getScrollPosition({ scrollContainer, direction });
            const offsetX = nextPos[0] - pos[0];
            const offsetY = nextPos[1] - pos[1];

            if (!offsetX && !offsetY) {
                return;
            }
            moveable.targetDragger.scrollBy(direction[0] ? offsetX : 0, direction[1] ? offsetY : 0, inputEvent, false);

            setTimeout(() => {
                if (datas.prevClientX !== clientX || datas.prevClientY !== clientY) {
                    return;
                }

                moveable.targetDragger.onDrag(inputEvent, true);
            }, 10);
        });
    },
};
