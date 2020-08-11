import {
  Component, Input, OnDestroy,
  OnInit, OnChanges, SimpleChanges, EventEmitter, Output
} from '@angular/core';
import Moveable, {
  PROPERTIES, EVENTS, MoveableOptions, MoveableEventsParameters,
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
  @Input() public draggable!: Required<MoveableOptions>['draggable'];
  @Input() public resizable!: Required<MoveableOptions>['resizable'];
  @Input() public scalable!: Required<MoveableOptions>['scalable'];
  @Input() public rotatable!: Required<MoveableOptions>['rotatable'];
  @Input() public warpable!: Required<MoveableOptions>['warpable'];
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
  @Input() public getScrollPosition!: Required<MoveableOptions>['getScrollPosition'];

  @Input() public rootContainer!: Required<MoveableOptions>['rootContainer'];
  @Input() public zoom!: Required<MoveableOptions>['zoom'];
  @Input() public transformOrigin!: Required<MoveableOptions>['transformOrigin'];
  @Input() public snapDigit!: Required<MoveableOptions>['snapDigit'];
  @Input() public isDisplaySnapDigit!: Required<MoveableOptions>['isDisplaySnapDigit'];
  @Input() public innerBounds!: Required<MoveableOptions>['innerBounds'];

  @Input() public triggerAblesSimultaneously!: Required<MoveableOptions>['triggerAblesSimultaneously'];
  @Input() public snapGap!: Required<MoveableOptions>['snapGap'];

  @Input() public pinchOutside!: Required<MoveableOptions>['pinchOutside'];
  @Input() public padding!: Required<MoveableOptions>['padding'];
  @Input() public snapDistFormat!: Required<MoveableOptions>['snapDistFormat'];
  @Input() public dragTarget!: Required<MoveableOptions>['dragTarget'];

  @Input() public checkInput!: Required<MoveableOptions>['checkInput'];
  @Input() public cspNonce!: Required<MoveableOptions>['cspNonce'];
  @Input() public startDragRotate!: Required<MoveableOptions>['startDragRotate'];
  @Input() public originDraggable!: Required<MoveableOptions>['originDraggable'];
  @Input() public originRelative!: Required<MoveableOptions>['originRelative'];
  @Input() public defaultGroupOrigin!: Required<MoveableOptions>['defaultGroupOrigin'];
  @Input() public groupable!: Required<MoveableOptions>['groupable'];
  @Input() public clippable!: Required<MoveableOptions>['clippable'];
  @Input() public customClipPath!: Required<MoveableOptions>['customClipPath'];
  @Input() public defaultClipPath!: Required<MoveableOptions>['defaultClipPath'];
  @Input() public clipRelative!: Required<MoveableOptions>['clipRelative'];
  @Input() public dragWithClip!: Required<MoveableOptions>['dragWithClip'];
  @Input() public clipArea!: Required<MoveableOptions>['clipArea'];
  @Input() public roundable!: Required<MoveableOptions>['roundable'];
  @Input() public roundRelative!: Required<MoveableOptions>['roundRelative'];

  @Output() public dragStart!: EventEmitter<MoveableEventsParameters['dragStart']>;
  @Output() public drag!: EventEmitter<MoveableEventsParameters['drag']>;
  @Output() public dragEnd!: EventEmitter<MoveableEventsParameters['dragEnd']>;
  @Output() public dragGroupStart!: EventEmitter<MoveableEventsParameters['dragGroupStart']>;
  @Output() public dragGroup!: EventEmitter<MoveableEventsParameters['dragGroup']>;
  @Output() public dragGroupEnd!: EventEmitter<MoveableEventsParameters['dragGroupEnd']>;

  @Output() public resizeStart!: EventEmitter<MoveableEventsParameters['resizeStart']>;
  @Output() public resize!: EventEmitter<MoveableEventsParameters['resize']>;
  @Output() public resizeEnd!: EventEmitter<MoveableEventsParameters['resizeEnd']>;
  @Output() public resizeGroupStart!: EventEmitter<MoveableEventsParameters['resizeGroupStart']>;
  @Output() public resizeGroup!: EventEmitter<MoveableEventsParameters['resizeGroup']>;
  @Output() public resizeGroupEnd!: EventEmitter<MoveableEventsParameters['resizeGroupEnd']>;

  @Output() public scaleStart!: EventEmitter<MoveableEventsParameters['scaleStart']>;
  @Output() public scale!: EventEmitter<MoveableEventsParameters['scale']>;
  @Output() public scaleEnd!: EventEmitter<MoveableEventsParameters['scaleEnd']>;
  @Output() public scaleGroupStart!: EventEmitter<MoveableEventsParameters['scaleGroupStart']>;
  @Output() public scaleGroup!: EventEmitter<MoveableEventsParameters['scaleGroup']>;
  @Output() public scaleGroupEnd!: EventEmitter<MoveableEventsParameters['scaleGroupEnd']>;

  @Output() public rotateStart!: EventEmitter<MoveableEventsParameters['rotateStart']>;
  @Output() public rotate!: EventEmitter<MoveableEventsParameters['rotate']>;
  @Output() public rotateEnd!: EventEmitter<MoveableEventsParameters['rotateEnd']>;
  @Output() public rotateGroupStart!: EventEmitter<MoveableEventsParameters['rotateGroupStart']>;
  @Output() public rotateGroup!: EventEmitter<MoveableEventsParameters['rotateGroup']>;
  @Output() public rotateGroupEnd!: EventEmitter<MoveableEventsParameters['rotateGroupEnd']>;

  @Output() public warpStart!: EventEmitter<MoveableEventsParameters['warpStart']>;
  @Output() public warp!: EventEmitter<MoveableEventsParameters['warp']>;
  @Output() public warpEnd!: EventEmitter<MoveableEventsParameters['warpEnd']>;

  @Output() public pinchStart!: EventEmitter<MoveableEventsParameters['pinchStart']>;
  @Output() public pinch!: EventEmitter<MoveableEventsParameters['pinch']>;
  @Output() public pinchEnd!: EventEmitter<MoveableEventsParameters['pinchEnd']>;
  @Output() public pinchGroupStart!: EventEmitter<MoveableEventsParameters['pinchGroupStart']>;
  @Output() public pinchGroup!: EventEmitter<MoveableEventsParameters['pinchGroup']>;
  @Output() public pinchGroupEnd!: EventEmitter<MoveableEventsParameters['pinchGroupEnd']>;

  @Output() public click!: EventEmitter<MoveableEventsParameters['click']>;
  @Output() public clickGroup!: EventEmitter<MoveableEventsParameters['clickGroup']>;

  @Output() public renderStart!: EventEmitter<MoveableEventsParameters['renderStart']>;
  @Output() public render!: EventEmitter<MoveableEventsParameters['render']>;
  @Output() public renderEnd!: EventEmitter<MoveableEventsParameters['renderEnd']>;
  @Output() public renderGroupStart!: EventEmitter<MoveableEventsParameters['renderGroupStart']>;
  @Output() public renderGroup!: EventEmitter<MoveableEventsParameters['renderGroup']>;
  @Output() public renderGroupEnd!: EventEmitter<MoveableEventsParameters['renderGroupEnd']>;

  @Output() public scroll!: EventEmitter<MoveableEventsParameters['scroll']>;
  @Output() public scrollGroup!: EventEmitter<MoveableEventsParameters['scrollGroup']>;

  @Output() public snap!: EventEmitter<MoveableEventsParameters['snap']>;

  @Output() public clipStart!: EventEmitter<MoveableEventsParameters['clipStart']>;
  @Output() public clip!: EventEmitter<MoveableEventsParameters['clip']>;
  @Output() public clipEnd!: EventEmitter<MoveableEventsParameters['clipEnd']>;

  @Output() public roundStart!: EventEmitter<MoveableEventsParameters['roundStart']>;
  @Output() public round!: EventEmitter<MoveableEventsParameters['round']>;
  @Output() public roundEnd!: EventEmitter<MoveableEventsParameters['roundEnd']>;

  @Output() public dragOriginStart!: EventEmitter<MoveableEventsParameters['dragOriginStart']>;
  @Output() public dragOrigin!: EventEmitter<MoveableEventsParameters['dragOrigin']>;
  @Output() public dragOriginEnd!: EventEmitter<MoveableEventsParameters['dragOriginEnd']>;


  constructor() {
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
      // @ts-expect-error
      moveable[name] = currentValue;
    }
  }
  ngOnDestroy() {
    this.moveable.destroy();
  }
}
