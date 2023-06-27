/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";
import { MoveableInterface, MoveableOptions, MoveableEvents } from "moveable";

export type SvelteMoveableEvents = {
    [key in keyof MoveableEvents]: CustomEvent<MoveableEvents[key]>;
}
export default class MoveableComponent<T = {}> extends SvelteComponentTyped<
    MoveableOptions & T,
    SvelteMoveableEvents
> { }

export default interface MoveableComponent extends MoveableInterface {
}
export * from "moveable";
