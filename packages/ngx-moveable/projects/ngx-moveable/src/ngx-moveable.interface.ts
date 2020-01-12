import Moveable, { MoveableInterface, METHODS } from 'moveable';
import { MethodInterface, withMethods } from 'framework-utils';

export class NgxMoveableInterface {
  @withMethods(METHODS, { dragStart: 'ngDragStart' })
  protected moveable!: Moveable;
}

export interface NgxMoveableInterface extends MethodInterface<MoveableInterface, Moveable, NgxMoveableInterface, {
    'dragStart': 'ngDragStart'
}> {}
