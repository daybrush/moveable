import { Component, ViewChild } from '@angular/core';
import { OnPinch, OnScale } from 'moveable';


@Component({
// tslint:disable-next-line: component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('target', { static: false }) target: HTMLDivElement;
  scalable = true;
  resizable = false;
  warpable = false;

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
  onPinch(e: OnPinch) {

  }
  onScale(e: OnScale) {

  }

}
