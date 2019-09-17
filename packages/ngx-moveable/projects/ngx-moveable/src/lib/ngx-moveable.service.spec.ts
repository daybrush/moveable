import { TestBed } from '@angular/core/testing';

import { NgxMoveableService } from './ngx-moveable.service';

describe('NgxMoveableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxMoveableService = TestBed.get(NgxMoveableService);
    expect(service).toBeTruthy();
  });
});
