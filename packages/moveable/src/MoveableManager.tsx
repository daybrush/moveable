import { ref, Properties } from "framework-utils";
import * as React from "react";
import { renderSelf, ContainerProvider } from "croact";
import InnerMoveable from "./InnerMoveable";
import {
    MoveableInterface,
    MoveableOptions, MoveableProperties,
} from "react-moveable/types";
import { camelize, getDocument, isArray } from "@daybrush/utils";
import { MoveableEventsParameters } from "./types";
import { PROPERTIES, EVENTS, METHODS } from "./consts";
import EventEmitter from "@scena/event-emitter";
/**
 * Moveable is Draggable! Resizable! Scalable! Rotatable!
 * @sort 1
 * @alias Moveable
 * @extends EventEmitter
 */
@Properties(METHODS, (prototype, property) => {
    if (prototype[property]) {
        return;
    }
    prototype[property] = function(...args: any[]) {
        const self = this.getMoveable();

        if (!self || !self[property]) {
            return;
        }
        return self[property](...args);
    };
})
@Properties(PROPERTIES, (prototype, property) => {
    Object.defineProperty(prototype, property, {
        get() {
            return this.getMoveable().props[property];
        },
        set(value) {
            this.setState({
                [property]: value,
            });
        },
        enumerable: true,
        configurable: true,
    });
})
class MoveableManager extends EventEmitter<MoveableEventsParameters> {
    private innerMoveable!: InnerMoveable | null;
    private containerProvider: ContainerProvider | null = null;
    private selfElement: HTMLElement | null = null;
    private _warp = false;
    /**
     *
     */
    constructor(parentElement: HTMLElement, options: MoveableOptions = {}) {
        super();
        const nextOptions = { ...options };

        const events: any = {};

        EVENTS.forEach(name => {
            events[camelize(`on ${name}`)] = (e: any) => this.trigger<any>(name, e);
        });
        let selfElement!: HTMLElement;

        if (options.warpSelf) {
            delete options.warpSelf;
            this._warp = true;
            selfElement = parentElement;
        } else {
            selfElement = getDocument(parentElement).createElement("div");
            parentElement.appendChild(selfElement);
        }
        this.containerProvider = renderSelf(
            <InnerMoveable
                ref={ref(this, "innerMoveable")}
                {...nextOptions}
                {...events}
            /> as any,
            selfElement,
        );

        this.selfElement = selfElement;
        const target = nextOptions.target!;
        if (isArray(target) && target.length > 1) {
            this.updateRect();
        }
    }
    public setState(state: Partial<MoveableOptions>, callback?: () => any) {
        this.innerMoveable!.setState(state, callback);
    }
    public forceUpdate(callback?: () => any) {
        this.innerMoveable!.forceUpdate(callback);
    }
    public dragStart(e: MouseEvent | TouchEvent, target: EventTarget | null = e.target) {
        const innerMoveable = this.innerMoveable;
        if ((innerMoveable as any).$_timer) {
            this.forceUpdate();
        }
        this.getMoveable().dragStart(e, target);
    }
    public destroy() {
        const selfElement = this.selfElement!;

        renderSelf(
            null,
            selfElement!,
            this.containerProvider,
        );
        if (!this._warp) {
            selfElement?.parentElement?.removeChild(selfElement);
        }
        this.containerProvider = null;

        this.off();
        this.selfElement = null;
        this.innerMoveable = null;
    }
    private getMoveable() {
        return this.innerMoveable!.moveable;
    }
}

interface MoveableManager extends MoveableInterface, MoveableProperties {
}

export default MoveableManager;
