import { MoveableEventsParameters, MoveableOptions } from 'moveable';
import { EventEmitter } from '@angular/core';

export type RequiredMoveableOptions = Required<MoveableOptions>;
export type NgxMoveableEvents = {
  [key in keyof MoveableEventsParameters]: EventEmitter<MoveableEventsParameters[key]>;
};
