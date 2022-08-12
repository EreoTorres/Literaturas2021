import { TestBed } from '@angular/core/testing';

import { ExpedienteDigitalService } from '../expediente-digital/expediente-digital.service';

describe('ExpedienteDigitalService', () => {
  let service: ExpedienteDigitalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpedienteDigitalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
