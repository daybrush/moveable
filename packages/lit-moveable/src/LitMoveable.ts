import { LitElement, html, customElement, property } from "lit-element";
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
    const realName = name === "draggable" ? "mvDraggable" : name;

    property()(prototype, realName);
})
@customElement("lit-moveable")
export class LitMoveable extends LitElement {
    @withMethods(METHODS as any, { dragStart: "dragStartMoveable" })
    private moveable!: VanillaMoveable;
    public firstUpdated() {
        const options: Partial<MoveableOptions> = {};

        PROPERTIES.forEach(name => {
            const litName = name === "draggable" ? "mvDraggable" : name;

            if (!isUndefined(this[litName])) {
                options[name as any] = this[litName];
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
            const litName = propName === "mvDraggable" ? "draggable" : propName;

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
