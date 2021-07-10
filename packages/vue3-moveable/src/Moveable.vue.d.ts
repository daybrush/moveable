import { MethodInterface } from "framework-utils";
import VanillaMoveable, { MoveableProperties, MoveableInterface } from "moveable";

export default class Moveable { }
export default interface VueMoveable
    extends MoveableProperties, MoveableInterface {
    $el: HTMLElement;
    $_moveable: VanillaMoveable;
    $props: MoveableProperties;
}
