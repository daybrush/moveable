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
  OnPinchStart, OnPinchGroupStart, OnPinchGroup, OnPinchGroupEnd, OnClickGroup, OnClick,
  OnScrollGroup, OnScroll, OnRenderGroupEnd, OnRenderGroup, OnRenderGroupStart, OnRenderEnd, OnRenderStart, OnRender, MoveableEvents,
} from 'moveable';
import { IObject } from '@daybrush/utils';
import { NgxMoveableInterface, NgxMoveableEvents } from './types';
import { Able } from 'moveable';


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
  implements OnDestroy, OnInit, OnChanges, Required<MoveableOptions>, NgxMoveableInterface, NgxMoveableEvents {
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
  @Input() public snapVertical!: boolean;
  @Input() public snapElement!: boolean;
  @Input() public snapHorizontal!: boolean;
  @Input() public snapThreshold!: number;
  @Input() public horizontalGuidelines!: number[];
  @Input() public verticalGuidelines!: number[];
  @Input() public elementGuidelines!: Element[];
  @Input() public bounds!: { left?: number, top?: number, right?: number, bottom?: number };
  @Input() public dragArea!: boolean;
  @Input() public rotationPosition!: 'top' | 'bottom' | 'left' | 'right';
  @Input() public baseDirection!: number[];
  @Input() public defaultGroupRotate!: boolean;
  @Input() public ables!: Able[];

  @Input() public className!: string;
  @Input() public renderDirections!: string[];
  @Input() public scrollable!: boolean;
  @Input() public scrollContainer!: HTMLElement;
  @Input() public scrollThreshold!: number;
  @Input() public getScrollPosition!: MoveableOptions['getScrollPosition'];

  @Output() public dragStart!: EventEmitter<MoveableEvents['dragStart']>;
  @Output() public drag!: EventEmitter<MoveableEvents['drag']>;
  @Output() public dragEnd!: EventEmitter<MoveableEvents['dragEnd']>;
  @Output() public dragGroupStart!: EventEmitter<MoveableEvents['dragGroupStart']>;
  @Output() public dragGroup!: EventEmitter<MoveableEvents['dragGroup']>;
  @Output() public dragGroupEnd!: EventEmitter<MoveableEvents['dragGroupEnd']>;

  @Output() public resizeStart!: EventEmitter<MoveableEvents['resizeStart']>;
  @Output() public resize!: EventEmitter<MoveableEvents['resize']>;
  @Output() public resizeEnd!: EventEmitter<MoveableEvents['resizeEnd']>;
  @Output() public resizeGroupStart!: EventEmitter<MoveableEvents['resizeGroupStart']>;
  @Output() public resizeGroup!: EventEmitter<MoveableEvents['resizeGroup']>;
  @Output() public resizeGroupEnd!: EventEmitter<MoveableEvents['resizeGroupEnd']>;

  @Output() public scaleStart!: EventEmitter<MoveableEvents['scaleStart']>;
  @Output() public scale!: EventEmitter<MoveableEvents['scale']>;
  @Output() public scaleEnd!: EventEmitter<MoveableEvents['scaleEnd']>;
  @Output() public scaleGroupStart!: EventEmitter<MoveableEvents['scaleGroupStart']>;
  @Output() public scaleGroup!: EventEmitter<MoveableEvents['scaleGroup']>;
  @Output() public scaleGroupEnd!: EventEmitter<MoveableEvents['scaleGroupEnd']>;

  @Output() public rotateStart!: EventEmitter<MoveableEvents['rotateStart']>;
  @Output() public rotate!: EventEmitter<MoveableEvents['rotate']>;
  @Output() public rotateEnd!: EventEmitter<MoveableEvents['rotateEnd']>;
  @Output() public rotateGroupStart!: EventEmitter<MoveableEvents['rotateGroupStart']>;
  @Output() public rotateGroup!: EventEmitter<MoveableEvents['rotateGroup']>;
  @Output() public rotateGroupEnd!: EventEmitter<MoveableEvents['rotateGroupEnd']>;

  @Output() public warpStart!: EventEmitter<MoveableEvents['warpStart']>;
  @Output() public warp!: EventEmitter<MoveableEvents['warp']>;
  @Output() public warpEnd!: EventEmitter<MoveableEvents['warpEnd']>;

  @Output() public pinchStart!: EventEmitter<MoveableEvents['pinchStart']>;
  @Output() public pinch!: EventEmitter<MoveableEvents['pinch']>;
  @Output() public pinchEnd!: EventEmitter<MoveableEvents['pinchEnd']>;
  @Output() public pinchGroupStart!: EventEmitter<MoveableEvents['pinchGroupStart']>;
  @Output() public pinchGroup!: EventEmitter<MoveableEvents['pinchGroup']>;
  @Output() public pinchGroupEnd!: EventEmitter<MoveableEvents['pinchGroupEnd']>;

  @Output() public click!: EventEmitter<MoveableEvents['click']>;
  @Output() public clickGroup!: EventEmitter<MoveableEvents['clickGroup']>;

  @Output() public renderStart!: EventEmitter<MoveableEvents['renderStart']>;
  @Output() public render!: EventEmitter<MoveableEvents['render']>;
  @Output() public renderEnd!: EventEmitter<MoveableEvents['renderEnd']>;
  @Output() public renderGroupStart!: EventEmitter<MoveableEvents['renderGroupStart']>;
  @Output() public renderGroup!: EventEmitter<MoveableEvents['renderGroup']>;
  @Output() public renderGroupEnd!: EventEmitter<MoveableEvents['renderGroupEnd']>;

  @Output() public scroll!: EventEmitter<OnScroll>;
  @Output() public scrollGroup!: EventEmitter<OnScrollGroup>;


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
      (options as any)[name] = this[name];
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
  ngDragStart(e: MouseEvent | TouchEvent) {
    this.moveable.dragStart(e);
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
  setState(state: any, callback: () => any) {
    this.moveable.setState(state, callback);
  }
  isInside(clientX: number, clientY: number) {
    return this.moveable.isInside(clientX, clientY);
  }
  destroy() {
    this.moveable.destroy();
  }

}
