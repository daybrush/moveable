import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import VanillaMoveable, {
    PROPERTIES,
    EVENTS,
    METHODS,
    MoveableOptions,
    MoveableInterface,
} from "moveable";
import { Properties, withMethods, MethodInterface } from "framework-utils";
import { camelize, isUndefined } from "@daybrush/utils";
import { LitMoveableOptions } from "./types";

@Properties(PROPERTIES as any, (prototype, name) => {
    if (name === "draggable") {
        property()(prototype, "mvDraggable");
        property()(prototype, "litDraggable");
    } else {
        property()(prototype, name);
    }

})
@customElement("lit-moveable")
export class LitMoveable extends LitElement {
    @withMethods(METHODS as any)
    private moveable!: VanillaMoveable;
    public dragStartMoveable(e: MouseEvent | TouchEvent) {
        return this.moveable.dragStart(e);
    }
    public litDragStart(e: MouseEvent | TouchEvent) {
        return this.moveable.dragStart(e);
    }
    public firstUpdated() {
        const options: Partial<MoveableOptions> = {};

        PROPERTIES.forEach(name => {
            let value: any;
            if (name === "draggable") {
                value = this.mvDraggable ?? this.litDraggable;

            } else {
                value = this[name];
            }
            if (!isUndefined(value)) {
                options[name as any] = value;
            }
        });

        this.moveable = new VanillaMoveable(this, {
            portalContainer: this,
            ...options,
        });

        const moveable = this.moveable;

        EVENTS.forEach((name, i) => {
            moveable.on(name as any, e => {
                const result = this.dispatchEvent(new CustomEvent(camelize(`lit ${name}`), {
                    detail: { ...e },
                }));

                if (result === false) {
                    (e as any).stop();
                }
            });
        });
    }
    public render() {
        return html`<slot></slot>`;
    }
    public updated(changedProperties) {
        const moveable = this.moveable;
        changedProperties.forEach((oldValue, propName) => {
            const litName = propName === "mvDraggable" || propName === "litMoveable"
                ? "draggable"
                : propName;

            if (PROPERTIES.indexOf(litName) > -1) {
                moveable[litName] = this[propName];
            }
        });
    }
    public disconnectedCallback() {
        super.disconnectedCallback();
        this.moveable.destroy();
    }
}
export interface LitMoveable extends LitMoveableOptions, MethodInterface<MoveableInterface, VanillaMoveable, LitMoveable> { }

declare global {
    interface HTMLElementTagNameMap {
        "lit-moveable": LitMoveable;
    }
}
