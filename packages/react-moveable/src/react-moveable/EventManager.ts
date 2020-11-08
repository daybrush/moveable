import { Able, MoveableManagerInterface } from "./types";

export default class EventManager {
    private ables: Able[] = [];
    constructor(
        private target: HTMLElement | SVGElement | null,
        private moveable: MoveableManagerInterface | null,
        private eventName: string,
    ) {
        this.target!.addEventListener(this.eventName.toLowerCase(), this.onEvent);
    }
    public setAbles(ables: Able[]) {
        this.ables = ables;
    }
    public onEvent = (e: Event) => {
        const eventName = this.eventName;
        const moveable = this.moveable;

        this.ables.forEach(able => {
            (able as any)[eventName]({
                inputEvent: e,
            }, moveable);
        })
    }
    public destroy() {
        this.target!.removeEventListener(this.eventName.toLowerCase(), this.onEvent);
        this.target = null;
        this.moveable = null;
    }
}
