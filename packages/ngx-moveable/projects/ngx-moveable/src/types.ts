import { MoveableInterface, MoveableEvents } from 'moveable';
import { EventEmitter } from '@angular/core';

export type NgxMoveableKeys = Exclude<keyof MoveableInterface, 'dragStart'>;
export type NgxMoveableInterface = {
  [key in NgxMoveableKeys]: MoveableInterface[key];
};

export type NgxMoveableEvents = {
  [key in keyof MoveableEvents]: EventEmitter<MoveableEvents[key]>;
}
