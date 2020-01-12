import { MoveableEvents } from 'moveable';
import { EventEmitter } from '@angular/core';


export type NgxMoveableEvents = {
  [key in keyof MoveableEvents]: EventEmitter<MoveableEvents[key]>;
};
