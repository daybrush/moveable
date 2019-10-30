import MoveableManager from "../MoveableManager";
import { ScrollableProps } from "../types";
import { getOffsetInfo } from "../utils";


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

        e.datas.scrollContainer = scrollContainer;
        e.datas.scrollRect = {
            left: scrollClientRect.left,
            top: scrollClientRect.top,
            width: scrollClientRect.width,
            height: scrollClientRect.height,
        };

        // this.checkScroll(moveable, e);
    },
    drag(moveable: MoveableManager<ScrollableProps>, e: any) {
        this.checkScroll(moveable, e);
    },
    dragEnd(moveable: MoveableManager<ScrollableProps>, e: any) {

    },
    checkScroll(moveable: MoveableManager<ScrollableProps>, e: any) {
        const datas = e.datas;
        const inputEvent = e.inputEvent;
        const clientX = e.clientX;
        const clientY = e.clientY;
        const {
            scrollContainer,
            scrollRect,
            prevClientX,
            prevClientY,
        } = datas;


        let offsetX = 0;
        let offsetY = 0;

        if (scrollRect.top > clientY) {
            offsetY = -10;
        } else if (scrollRect.top + scrollRect.height < clientY) {
            offsetY = 10;
        }
        if (scrollRect.left > clientX) {
            offsetX = -10;
        } else if (scrollRect.left + scrollRect.width < clientX) {
            offsetX = 10;
        }
        if (e.isScroll) {
            if (prevClientX !== clientX || prevClientY !== clientY) {
                return;
            }
        } else {
            datas.prevClientX = clientX;
            datas.prevClientY = clientY;
        }
        if (offsetY || offsetY) {
            requestAnimationFrame(() => {
                const scrollTop = scrollContainer.scrollTop;
                const scrollLeft = scrollContainer.scrollLeft;

                if (offsetY < 0) {
                    offsetY = scrollTop + offsetY < 0 ? -scrollTop : offsetY;
                }
                if (offsetX < 0) {
                    offsetX = scrollLeft + offsetX < 0 ? -scrollLeft : offsetX;
                }
                if (offsetX || offsetY) {
                    scrollContainer.scrollTop += offsetY;
                    moveable.targetDragger.scrollBy(0, offsetY, inputEvent);
                }
            });
        }
    },
};
