import {
  Component, Input, OnDestroy,
  OnInit, OnChanges, SimpleChanges, EventEmitter, Output
} from '@angular/core';
import Moveable, {
  PROPERTIES, EVENTS, MoveableOptions,
  OnScrollGroup, OnScroll, MoveableEvents, OnSnap,
} from 'moveable';
import { IObject } from '@daybrush/utils';
import { NgxMoveableEvents } from './types';
import { Able } from 'moveable';
import { NgxMoveableInterface } from './ngx-moveable.interface';


// @dynamic
@Component({
  selector: 'ngx-moveable',
  template: '',
})
export class NgxMoveableComponent
  extends NgxMoveableInterface
  implements OnDestroy, OnInit, OnChanges, Required<MoveableOptions>, NgxMoveableEvents {
  @Input() public draggable!: MoveableOptions['draggable'];
  @Input() public resizable!: MoveableOptions['resizable'];
  @Input() public scalable!: MoveableOptions['scalable'];
  @Input() public rotatable!: MoveableOptions['rotatable'];
  @Input() public warpable!: MoveableOptions['warpable'];
  @Input() public pinchable!: boolean | Array<'rotatable' | 'resizable' | 'scalable'>;
  @Input() public snappable!: boolean | string[];
  @Input() public origin!: boolean;
  @Input() public target!: SVGElement | HTMLElement | Array<SVGElement | HTMLElement>;
  @Input() public container!: SVGElement | HTMLElement | null;
  @Input() public throttleDrag!: number;
  @Input() public throttleDragRotate!: number;
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
  @Input() public defaultGroupRotate!: number;
  @Input() public ables!: Able[];

  @Input() public className!: string;
  @Input() public renderDirections!: string[];
  @Input() public scrollable!: boolean;
  @Input() public scrollContainer!: HTMLElement;
  @Input() public scrollThreshold!: number;
  @Input() public getScrollPosition!: MoveableOptions['getScrollPosition'];

  @Input() public rootContainer!: MoveableOptions['rootContainer'];
  @Input() public zoom!: MoveableOptions['zoom'];
  @Input() public transformOrigin!: MoveableOptions['transformOrigin'];
  @Input() public snapDigit!: MoveableOptions['snapDigit'];
  @Input() public isDisplaySnapDigit!: MoveableOptions['isDisplaySnapDigit'];
  @Input() public innerBounds!: MoveableOptions['innerBounds'];

  @Input() public triggerAblesSimultaneously!: MoveableOptions['triggerAblesSimultaneously'];
  @Input() public snapGap!: MoveableOptions['snapGap'];

  @Input() public pinchOutside!: MoveableOptions['pinchOutside'];
  @Input() public padding!: MoveableOptions['padding'];
  @Input() public snapDistFormat!: MoveableOptions['snapDistFormat'];
  @Input() public dragTarget!: MoveableOptions['dragTarget'];

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

  @Output() public snap!: EventEmitter<OnSnap>;

  constructor() {
    super();
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
}
