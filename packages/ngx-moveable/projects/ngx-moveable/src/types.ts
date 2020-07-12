import { MoveableEventsParameters } from 'moveable';
import { EventEmitter } from '@angular/core';


export type NgxMoveableEvents = {
  [key in keyof MoveableEventsParameters]: EventEmitter<MoveableEventsParameters[key]>;
};
