import { SvelteComponentDev } from "svelte/internal";
import Moveable, { MoveableInterface, MoveableOptions } from "moveable";

export default class MoveableComponent<T={}> extends SvelteComponentDev {
    $$prop_def: MoveableOptions & T;
    getInstance(): Moveable;
}
export default interface MoveableComponent extends MoveableInterface {
}


export * from "moveable";
