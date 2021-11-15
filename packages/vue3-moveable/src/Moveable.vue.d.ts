import { MethodInterface } from "framework-utils";
import VanillaMoveable, { MoveableProperties, MoveableInterface } from "moveable";


interface VueMoveableInterface
    extends MoveableProperties, MoveableInterface {
    $el: HTMLElement;
    $_moveable: VanillaMoveable;
    $props: MoveableProperties;
}

declare const VueMoveable: VueMoveableInterface;
type VueMoveable = VueMoveableInterface;

export default VueMoveable;
