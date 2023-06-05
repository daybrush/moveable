import {
  Component,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  ElementRef,
  NgZone,
} from '@angular/core';
import Moveable, { PROPERTIES, EVENTS, MoveableOptions } from 'moveable';
import { IObject } from '@daybrush/utils';

import { NgxMoveableInterface } from './ngx-moveable.interface';
import { ANGULAR_MOVEABLE_INPUTS, ANGULAR_MOVEABLE_OUTPUTS } from './consts';

@Component({
  selector: 'ngx-moveable',
  template: '',
  inputs: ANGULAR_MOVEABLE_INPUTS,
  outputs: ANGULAR_MOVEABLE_OUTPUTS,
})
export class NgxMoveableComponent
  extends NgxMoveableInterface
  implements OnDestroy, OnInit, OnChanges
{
  constructor(
    private _ngZone: NgZone,
    private _elementRef: ElementRef<HTMLElement>
  ) {
    super();
    EVENTS.forEach((name) => {
      // @ts-expect-error
      this[name] = new EventEmitter<unknown>();
    });
  }

  ngOnInit(): void {
    const options: MoveableOptions = {};
    const events: IObject<any> = {};

    PROPERTIES.forEach(name => {
      // @ts-expect-error
      (options as any)[name] = this[name];
    });

    EVENTS.forEach(name => {
      events[name] = (event: any) => {
        // @ts-expect-error
        const emitter = this[name];
        if (emitter && (emitter.observed || emitter.observers.length > 0)) {
          this._ngZone.run(() => emitter.emit(event));
        }
      };
    });

    const container = this._elementRef.nativeElement;

    this.moveable = this._ngZone.runOutsideAngular(() => new Moveable(container, {
      ...options,
      warpSelf: true,
    }));
    this.moveable.on(events);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const moveable = this.moveable;

    if (!moveable) {
      return;
    }
    for (const name in changes) {
      const { previousValue, currentValue } = changes[name];

      if (previousValue === currentValue) {
        continue;
      }
      // @ts-expect-error
      moveable[name] = currentValue;
    }
  }

  ngOnDestroy() {
    this.moveable.destroy();
  }
}
