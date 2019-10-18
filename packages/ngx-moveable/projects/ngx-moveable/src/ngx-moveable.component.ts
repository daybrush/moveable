import {
  Component, Input, OnDestroy,
  OnInit, OnChanges, SimpleChanges, EventEmitter, Output
} from '@angular/core';
import Moveable, {
  PROPERTIES, EVENTS, MoveableOptions,
  OnDrag, OnDragStart, OnDragEnd,
  OnResize, OnResizeStart, OnResizeEnd,
  OnScaleStart, OnScale, OnScaleEnd,
  OnWarpStart, OnDragGroupStart, OnWarp,
  OnWarpEnd, OnDragGroupEnd, OnDragGroup,
  OnScaleGroup, OnScaleGroupStart, OnResizeGroup,
  OnResizeGroupStart, OnScaleGroupEnd, OnResizeGroupEnd,
  OnRotateStart, OnRotate, OnRotateEnd, OnRotateGroupStart,
  OnRotateGroup, OnRotateGroupEnd, OnPinch, OnPinchEnd,
  OnPinchStart, OnPinchGroupStart, OnPinchGroup, OnPinchGroupEnd, OnClickGroup,
} from 'moveable';
import { IObject } from '@daybrush/utils';
import { NgxMoveableInterface } from './types';


// type NgxMoveableEmitter = {
//   [name in keyof MoveableEvents]: EventEmitter<MoveableEvents[name]>;
// };

// , MoveableGetterSetter, NgxMoveableEmitter


// @dynamic
@Component({
  selector: 'ngx-moveable',
  template: '',
})
export class NgxMoveableComponent
  implements OnDestroy, OnInit, OnChanges, Required<MoveableOptions>, NgxMoveableInterface {
  @Input() public draggable!: boolean;
  @Input() public resizable!: boolean;
  @Input() public scalable!: boolean;
  @Input() public rotatable!: boolean;
  @Input() public warpable!: boolean;
  @Input() public pinchable!: boolean | Array<'rotatable' | 'resizable' | 'scalable'>;
  @Input() public snappable!: boolean | string[];
  @Input() public origin!: boolean;
  @Input() public target!: SVGElement | HTMLElement | Array<SVGElement | HTMLElement>;
  @Input() public container!: SVGElement | HTMLElement | null;
  @Input() public throttleDrag!: number;
  @Input() public throttleResize!: number;
  @Input() public throttleScale!: number;
  @Input() public throttleRotate!: number;
  @Input() public keepRatio!: boolean;
  @Input() public edge!: boolean;
  @Input() public pinchThreshold!: number;
  @Input() public snapCenter!: boolean;
  @Input() public snapThreshold!: number;
  @Input() public horizontalGuidelines!: number[];
  @Input() public verticalGuidelines!: number[];
  @Input() public elementGuidelines!: Element[];
  @Input() public bounds!: { left?: number, top?: number, right?: number, bottom?: number };
  @Input() public dragArea!: boolean;
  @Input() public rotationPosition!: 'top' | 'bottom' | 'left' | 'right';

  @Output() public dragStart!: EventEmitter<OnDragStart>;
  @Output() public drag!: EventEmitter<OnDrag>;
  @Output() public dragEnd!: EventEmitter<OnDragEnd>;

  @Output() public resizeStart!: EventEmitter<OnResizeStart>;
  @Output() public resize!: EventEmitter<OnResize>;
  @Output() public resizeEnd!: EventEmitter<OnResizeEnd>;

  @Output() public scaleStart!: EventEmitter<OnScaleStart>;
  @Output() public scale!: EventEmitter<OnScale>;
  @Output() public scaleEnd!: EventEmitter<OnScaleEnd>;

  @Output() public rotateStart!: EventEmitter<OnRotateStart>;
  @Output() public rotate!: EventEmitter<OnRotate>;
  @Output() public rotateEnd!: EventEmitter<OnRotateEnd>;

  @Output() public warpStart!: EventEmitter<OnWarpStart>;
  @Output() public warp!: EventEmitter<OnWarp>;
  @Output() public warpEnd!: EventEmitter<OnWarpEnd>;

  @Output() public pinchStart!: EventEmitter<OnPinchStart>;
  @Output() public pinch!: EventEmitter<OnPinch>;
  @Output() public pinchEnd!: EventEmitter<OnPinchEnd>;

  @Output() public dragGroupStart!: EventEmitter<OnDragGroupStart>;
  @Output() public dragGroup!: EventEmitter<OnDragGroup>;
  @Output() public dragGroupEnd!: EventEmitter<OnDragGroupEnd>;

  @Output() public resizeGroupStart!: EventEmitter<OnResizeGroupStart>;
  @Output() public resizeGroup!: EventEmitter<OnResizeGroup>;
  @Output() public resizeGroupEnd!: EventEmitter<OnResizeGroupEnd>;

  @Output() public scaleGroupStart!: EventEmitter<OnScaleGroupStart>;
  @Output() public scaleGroup!: EventEmitter<OnScaleGroup>;
  @Output() public scaleGroupEnd!: EventEmitter<OnScaleGroupEnd>;

  @Output() public rotateGroupStart!: EventEmitter<OnRotateGroupStart>;
  @Output() public rotateGroup!: EventEmitter<OnRotateGroup>;
  @Output() public rotateGroupEnd!: EventEmitter<OnRotateGroupEnd>;

  @Output() public pinchGroupStart!: EventEmitter<OnPinchGroupStart>;
  @Output() public pinchGroup!: EventEmitter<OnPinchGroup>;
  @Output() public pinchGroupEnd!: EventEmitter<OnPinchGroupEnd>;

  @Output() public clickGroup!: EventEmitter<OnClickGroup>;


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

    this.moveable = new Moveable(this.container || document.body, options);
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
  ngOnDestroy() {
    this.moveable.destroy();
  }
  isMoveableElement(target: HTMLElement | SVGElement) {
    return this.moveable.isMoveableElement(target);
  }
  updateRect() {
    this.moveable.updateRect();
  }
  updateTarget() {
    this.moveable.updateTarget();
  }
  getRect() {
    return this.moveable.getRect();
  }
  isInside(clientX: number, clientY: number) {
    return this.moveable.isInside(clientX, clientY);
  }
  destroy() {
    this.moveable.destroy();
  }

}
