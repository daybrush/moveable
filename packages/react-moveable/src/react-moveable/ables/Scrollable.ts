import MoveableManager from "../MoveableManager";
import { ScrollableProps, OnScroll } from "../types";
import { triggerEvent, fillParams } from "../utils";

export default {
    name: "scrollable",
    canPinch: true,
    dragStart(moveable: MoveableManager<ScrollableProps>, e: any) {
        const props = moveable.props;
        // const offsetContainer = getOffsetInfo(container, container, true).offsetParent;

        const {
            scrollContainer = props.container || document.body,
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
        // this.checkScroll(moveable, e);
    },
    drag(moveable: MoveableManager<ScrollableProps>, e: any) {
        this.checkScroll(moveable, e);
    },
    dragEnd(moveable: MoveableManager<ScrollableProps>, e: any) {
        e.datas.isScroll = false;
    },
    checkScroll(moveable: MoveableManager<ScrollableProps>, e: any) {
        const datas = e.datas;

        if (!datas.isScroll) {
            return;
        }
        const {
            scrollThreshold = 0,
        } = moveable.props;
        const inputEvent = e.inputEvent;
        const clientX = e.clientX;
        const clientY = e.clientY;
        const isScroll = e.isScroll;
        const {
            scrollContainer,
            scrollRect,
            prevClientX,
            prevClientY,
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
        if (isScroll && (prevClientX !== clientX || prevClientY !== clientY)) {
            return;
        }
        if (!isScroll) {
            datas.prevClientX = clientX;
            datas.prevClientY = clientY;
        }

        const prevRect = moveable.state.clientRect!;
        const prevLeft = prevRect.left + moveable.state.beforeOrigin[0];
        const prevTop = prevRect.top + moveable.state.beforeOrigin[1];

        if () {

        }

        datas.pos = {
            left: prevLeft,
            top: prevTop,
        };

        if (direction[0] || direction[1]) {
            triggerEvent(moveable, "onScroll", fillParams<OnScroll>(moveable, e, {
                scrollContainer,
                direction,
                isOverflowX: false,
                isOverflowY: false,
            }));
            // requestAnimationFrame(() => {
            //     const rect = moveable.state.clientRect!;
            //     const left = rect.left + moveable.state.beforeOrigin[0];
            //     const top = rect.top + moveable.state.beforeOrigin[1];

            //     const offsetX = left - prevLeft;
            //     const offsetY = top - prevTop;

            //     if ((direction[0] && offsetX) || (direction[1] && offsetY)) {
            //         moveable.targetDragger.scrollBy(-offsetX, -offsetY, inputEvent);
            //     }
            // });
        }
    },
};
