import {
  Component, OnDestroy,
  OnInit, OnChanges, SimpleChanges, EventEmitter, ElementRef
} from '@angular/core';
import Moveable, {
  PROPERTIES, EVENTS, MoveableOptions,
} from 'moveable';
import { IObject } from '@daybrush/utils';
import { NgxMoveableInterface } from './ngx-moveable.interface';
import { ANGULAR_MOVEABLE_INPUTS, ANGULAR_MOVEABLE_OUTPUTS } from './consts';


// @dynamic
@Component({
  selector: 'ngx-moveable',
  template: '',
  inputs: ANGULAR_MOVEABLE_INPUTS,
  outputs: ANGULAR_MOVEABLE_OUTPUTS,
})
export class NgxMoveableComponent
  extends NgxMoveableInterface
  implements OnDestroy, OnInit, OnChanges {

  constructor(private _elementRef: ElementRef) {
    super();
    EVENTS.forEach(name => {
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
      events[name] = (e: any) => {
        // @ts-expect-error
        this[name].emit(e);
      };
    });

    const container = this._elementRef.nativeElement;

    this.moveable = new Moveable(container, {
      ...options,
      portalContainer: container,
    });
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
