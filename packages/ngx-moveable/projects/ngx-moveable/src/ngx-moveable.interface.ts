import Moveable, { MoveableInterface, METHODS, MoveableProperties } from 'moveable';
import { MethodInterface, withMethods } from 'framework-utils';
import { NgxMoveableEvents } from './types';

export class NgxMoveableInterface {
  @withMethods(METHODS, { dragStart: 'ngDragStart' })
  protected moveable!: Moveable;
}

export interface NgxMoveableInterface extends NgxMoveableEvents, MoveableProperties, MethodInterface<MoveableInterface, Moveable, NgxMoveableInterface, {
  'dragStart': 'ngDragStart'
}> { }
