import { Component, ViewChild, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Frame } from 'scenejs';
import { NgxMoveableComponent } from 'projects/ngx-moveable/src/public-api';
import type { OnPinch, OnDrag, OnScale, OnRotate, OnResize, OnWarp } from 'moveable';

// import { NgxMoveableComponent } from 'src/ngx-moveable';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('target', { static: false }) target!: ElementRef<HTMLDivElement>;
  @ViewChild('label', { static: false }) label!: ElementRef<HTMLDivElement>;
  @ViewChild('moveable', { static: false }) moveable!: NgxMoveableComponent;
  scalable = true;
  resizable = false;
  warpable = false;
  frame = new Frame({
    width: '250px',
    height: '200px',
    left: '0px',
    top: '0px',
    transform: {
      rotate: '0deg',
      scaleX: 1,
      scaleY: 1,
      matrix3d: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ],
    },
  });
  ngOnInit(): void {
    window.addEventListener('resize', this.onWindowReisze);
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowReisze);
  }
  onWindowReisze = () => {
    console.log(this.moveable.ngDragStart);
    this.moveable.updateRect();
  }
  clickScalable() {
    this.scalable = true;
    this.resizable = false;
    this.warpable = false;
  }
  clickResizable() {
    this.scalable = false;
    this.resizable = true;
    this.warpable = false;
  }
  clickWarpable() {
    this.scalable = false;
    this.resizable = false;
    this.warpable = true;
  }

  setTransform(target: HTMLElement | SVGElement) {
    target.style.cssText = this.frame.toCSS();
  }
  setLabel(clientX: number, clientY: number, text: string) {
    this.label.nativeElement.style.cssText = `
display: block; transform: translate(${clientX}px, ${clientY - 10}px) translate(-100%, -100%) translateZ(-100px);`;
    this.label.nativeElement.innerHTML = text;
  }
  onPinch({ target, clientX, clientY }: OnPinch) {
    setTimeout(() => {
      this.setLabel(clientX, clientY, `X: ${this.frame.get('left')}
  <br/>Y: ${this.frame.get('top')}
  <br/>W: ${this.frame.get('width')}
  <br/>H: ${this.frame.get('height')}
  <br/>S: ${this.frame.get('transform', 'scaleX').toFixed(2)}, ${this.frame.get('transform', 'scaleY').toFixed(2)}
  <br/>R: ${parseFloat(this.frame.get('transform', 'rotate')).toFixed(1)}deg
  `);
    });
  }
  onDrag({ target, clientX, clientY, top, left, isPinch }: OnDrag) {
    this.frame.set('left', `${left}px`);
    this.frame.set('top', `${top}px`);
    this.setTransform(target);
    if (!isPinch) {
      this.setLabel(clientX, clientY, `X: ${left}px<br/>Y: ${top}px`);
    }
  }
  onScale({ target, delta, clientX, clientY, isPinch }: OnScale) {
    const scaleX = this.frame.get('transform', 'scaleX') * delta[0];
    const scaleY = this.frame.get('transform', 'scaleY') * delta[1];
    this.frame.set('transform', 'scaleX', scaleX);
    this.frame.set('transform', 'scaleY', scaleY);
    this.setTransform(target);
    if (!isPinch) {
      this.setLabel(clientX, clientY, `S: ${scaleX.toFixed(2)}, ${scaleY.toFixed(2)}`);
    }
  }
  onRotate({ target, clientX, clientY, beforeDelta, isPinch }: OnRotate) {
    const deg = parseFloat(this.frame.get('transform', 'rotate')) + beforeDelta;

    this.frame.set('transform', 'rotate', `${deg}deg`);
    this.setTransform(target);
    if (!isPinch) {
      this.setLabel(clientX, clientY, `R: ${deg.toFixed(1)}`);
    }
  }
  onResize({ target, clientX, clientY, width, height, isPinch }: OnResize) {
    this.frame.set('width', `${width}px`);
    this.frame.set('height', `${height}px`);
    this.setTransform(target);
    if (!isPinch) {
      this.setLabel(clientX, clientY, `W: ${width}px<br/>H: ${height}px`);
    }
  }
  onWarp({ target, clientX, clientY, delta, multiply }: OnWarp) {
    this.frame.set('transform', 'matrix3d', multiply(this.frame.get('transform', 'matrix3d'), delta));
    this.setTransform(target);
    this.setLabel(clientX, clientY, `X: ${clientX}px<br/>Y: ${clientY}px`);
  }
  onEnd() {
    this.label.nativeElement.style.display = 'none';
  }
}
