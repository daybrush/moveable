import { MoveableManagerState, OnCustomDrag } from "./types";
import { convertDragDist } from "./utils";

export function setCustomDrag(
    state: MoveableManagerState<any>,
    delta: number[],
    inputEvent: any,
    isPinch: boolean,
    isConvert: boolean,
) {
    const result = state.dragger!.move(delta, inputEvent);
    const datas = result.originalDatas || result.datas;
    const draggableDatas = datas.draggable || (datas.draggable = {});

    return {
        ...(isConvert ? convertDragDist(state, result) : result),
        isDrag: true,
        isPinch: !!isPinch,
        parentEvent: true,
        datas: draggableDatas,
    };
}

export default class CustomDragger {
    private prevX = 0;
    private prevY = 0;
    private startX = 0;
    private startY = 0;
    private isDrag = false;
    private isFlag = false;
    private datas: any = {
        draggable: {},
    };

    public dragStart(client: number[], inputEvent: any) {
        this.isDrag = false;
        this.isFlag = false;
        this.datas = {
            draggable: {},
        };
        return {
            ...this.move(client, inputEvent),
            type: "dragstart",
        };
    }
    public drag(client: number[], inputEvent: any) {
        return this.move([
            client[0] - this.prevX,
            client[1] - this.prevY,
        ], inputEvent);
    }
    public move(delta: number[], inputEvent: any): OnCustomDrag {
        let clientX!: number;
        let clientY!: number;
        if (!this.isFlag) {
            this.prevX = delta[0];
            this.prevY = delta[1];
            this.startX = delta[0];
            this.startY = delta[1];

            clientX = delta[0];
            clientY = delta[1];

            this.isFlag = true;
        } else {

            clientX = this.prevX + delta[0];
            clientY = this.prevY + delta[1];
            this.isDrag = true;
        }

        this.prevX = clientX;
        this.prevY = clientY;

        return {
            type: "drag",
            clientX,
            clientY,
            inputEvent,
            isDrag: this.isDrag,
            distX: clientX - this.startX,
            distY: clientY - this.startY,
            deltaX: delta[0],
            deltaY: delta[1],
            datas: this.datas.draggable,
            originalDatas: this.datas,
            parentEvent: true,
            parentDragger: this,
        };
    }
}
