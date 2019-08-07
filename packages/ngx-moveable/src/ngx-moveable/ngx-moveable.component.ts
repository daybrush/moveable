import {
  Component, Input, OnDestroy,
  OnInit, OnChanges, SimpleChanges, EventEmitter, Output
} from '@angular/core';
import Moveable, {
  PROPERTIES, EVENTS, MoveableGetterSetter, MoveableEvents, MoveableOptions, OnDragStart, OnDrag,
} from 'moveable';
import { Properties } from 'framework-utils';
import { IObject } from '@daybrush/utils';

@Properties(PROPERTIES, (prototype, property) => {
  Input()(prototype, property);
})
@Properties(EVENTS, (prototype, property) => {
  Output()(prototype, property);
})
@Component({
  selector: 'ngx-moveable',
  template: '',
})
class NgxMoveableComponent implements OnDestroy, OnInit, OnChanges {
  private moveable!: Moveable;
  constructor() {
    EVENTS.forEach(name => {
      this[name] = new EventEmitter<any>();
    });
  }
  ngOnInit(): void {
    const options: MoveableOptions = {};
    const events: IObject<any> = {};

    PROPERTIES.forEach(name => {
      options[name] = this[name];
    });
    EVENTS.forEach(name => {
      events[name] = e => {
        this[name].emit(e);
      };
    });

    this.moveable = new Moveable(document.body, options);
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
      moveable[name] = currentValue;
    }
  }
  isMoveableElement(target: HTMLElement | SVGElement) {
    return this.moveable.isMoveableElement(target);
  }

  updateRect() {
    this.moveable.updateRect();
  }

  updateTarget(): void {
    this.moveable.updateTarget();
  }
  ngOnDestroy(): void {
    this.moveable.destroy();
  }
}

type NgxMoveableEmitter = {
  [name in keyof MoveableEvents]?: EventEmitter<MoveableEvents[name]>;
};
interface NgxMoveableComponent extends MoveableGetterSetter, NgxMoveableEmitter {
}

export { NgxMoveableComponent };


