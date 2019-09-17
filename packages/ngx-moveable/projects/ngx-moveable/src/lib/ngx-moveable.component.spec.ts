import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMoveableComponent } from './ngx-moveable.component';

describe('NgxMoveableComponent', () => {
  let component: NgxMoveableComponent;
  let fixture: ComponentFixture<NgxMoveableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxMoveableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxMoveableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
