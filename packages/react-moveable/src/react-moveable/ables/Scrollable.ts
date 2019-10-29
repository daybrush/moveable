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


        let offset = 0;
        if (scrollRect.top > clientY) {
            offset = -10;
        } else if (scrollRect.top + scrollRect.height < clientY) {
            offset = 10;
        }
        if (e.isScroll) {
            if (prevClientX !== clientX || prevClientY !== clientY) {
                return;
            }
        } else {
            datas.prevClientX = clientX;
            datas.prevClientY = clientY;
        }
        if (offset) {
            requestAnimationFrame(() => {
                const scrollTop = scrollContainer.scrollTop;

                if (offset < 0) {
                    offset = scrollTop + offset < 0 ? -scrollTop : offset;
                }
                scrollContainer.scrollTop += offset;
                moveable.targetDragger.scrollBy(0, offset, inputEvent);
            });
        }
    },
};
