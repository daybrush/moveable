import { MoveableManagerState, OnCustomDrag } from "./types";
import { convertDragDist } from "./utils";

export function setCustomDrag(state: MoveableManagerState<any>, delta: number[], inputEvent: any) {
    return {
        ...convertDragDist(state, state.dragger!.move(delta, inputEvent)),
        parentEvent: true,
    };
}

export default class CustomDragger {
    private prevX = 0;
    private prevY = 0;
    private startX = 0;
    private startY = 0;
    private isDrag = false;
    private isFlag = false;
    private datas = {};

    public dragStart(client: number[], inputEvent: any)  {
        this.isDrag = false;
        this.isFlag = false;
        this.datas = {};

        return this.move(client, inputEvent);
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
            clientX,
            clientY,
            inputEvent,
            isDrag: this.isDrag,
            distX: clientX - this.startX,
            distY: clientY - this.startY,
            deltaX: delta[0],
            deltaY: delta[1],
            datas: this.datas,
            parentEvent: true,
            parentDragger: this,
        };
    }
}
