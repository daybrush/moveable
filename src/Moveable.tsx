import EgComponent from "@egjs/component";
import { ref, Properties } from "framework-utils";
import * as React from "react";
import { render } from "react-dom";
import InnerMoveable from "./InnerMoveable";
import { MoveableOptions, MoveableGetterSetter, MoveableEvents } from "./types";
import {
    MoveableInterface,
    RectInfo,
} from "react-moveable/declaration/types";
import { PROPERTIES, EVENTS, METHODS } from "./consts";
import { camelize, isArray } from "@daybrush/utils";

/**
 * Moveable is Draggable! Resizable! Scalable! Rotatable!
 * @sort 1
 * @extends eg.Component
 */
@Properties(METHODS, (prototype, property) => {
    if (prototype[property]) {
        return;
    }
    prototype[property] = function(...args) {
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
class Moveable extends EgComponent {
    private innerMoveable!: InnerMoveable;
    private tempElement = document.createElement("div");

    /**
     *
     */
    constructor(parentElement: HTMLElement | SVGElement, options: MoveableOptions = {}) {
        super();
        const nextOptions = { container: parentElement, ...options };

        const events: any = {};

        EVENTS.forEach(name => {
            events[camelize(`on ${name}`)] = (e: any) => this.trigger(name, e);
        });

        render(
            <InnerMoveable
                ref={ref(this, "innerMoveable")}
                parentElement={parentElement}
                {...nextOptions}
                {...events}
            />,
            this.tempElement,
        );
        const target = nextOptions.target!;
        if (isArray(target) && target.length > 1) {
            this.updateRect();
        }
    }
    public setState(state: Partial<MoveableOptions>, callback?: () => any) {
        this.innerMoveable.setState(state, callback);
    }
    public destroy() {
        render(null, this.tempElement);
        this.off();
        this.tempElement = null;
        this.innerMoveable = null;
    }
    private getMoveable() {
        return this.innerMoveable.moveable;
    }
}

interface Moveable extends MoveableGetterSetter, MoveableInterface {
    on<T extends keyof MoveableEvents>(eventName: T, handlerToAttach: (event: MoveableEvents[T]) => any): this;
    on(eventName: string, handlerToAttach: (event: { [key: string]: any }) => any): this;
    on(events: { [key: string]: (event: { [key: string]: any }) => any }): this;
}

export default Moveable;
