import {
  MoveableEventsParameters,
  MoveableOptions,
  OnPinch,
  OnPinchEnd,
  OnPinchGroup,
  OnPinchGroupEnd,
  OnPinchGroupStart,
  OnPinchStart,
} from 'moveable';
import { EventEmitter } from '@angular/core';

export type RequiredMoveableOptions = Required<MoveableOptions>;
export type NgxMoveableEvents = {
  [key in keyof MoveableEventsParameters]: EventEmitter<
    MoveableEventsParameters[key]
  >;
};

export interface NgxPincheableEvents {
  pinchStart: EventEmitter<OnPinchStart>;
  pinch: EventEmitter<OnPinch>;
  pinchEnd: EventEmitter<OnPinchEnd>;
  pinchGroupStart: EventEmitter<OnPinchGroupStart>;
  pinchGroup: EventEmitter<OnPinchGroup>;
  pinchGroupEnd: EventEmitter<OnPinchGroupEnd>;
}
