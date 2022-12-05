import { Able, MoveableManagerInterface } from "./types";

export default class EventManager {
    private ables: Able[] = [];
    constructor(
        private target: HTMLElement | SVGElement | null,
        private moveable: MoveableManagerInterface | null,
        private eventName: string,
    ) {
        target!.addEventListener(eventName.toLowerCase(), this._onEvent);
    }
    public setAbles(ables: Able[]) {
        this.ables = ables;
    }
    public destroy() {
        this.target!.removeEventListener(this.eventName.toLowerCase(), this._onEvent);
        this.target = null;
        this.moveable = null;
    }
    private _onEvent = (e: Event) => {
        const eventName = this.eventName;
        const moveable = this.moveable!;

        if (moveable.state.disableNativeEvent) {
            return;
        }
        this.ables.forEach(able => {
            (able as any)[eventName](moveable, {
                inputEvent: e,
            });
        });
    }
}
