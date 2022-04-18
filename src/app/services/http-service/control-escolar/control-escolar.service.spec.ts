import { TestBed } from '@angular/core/testing';

import { ControlEscolarService } from './control-escolar.service';

describe('ControlEscolarService', () => {
  let service: ControlEscolarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlEscolarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
