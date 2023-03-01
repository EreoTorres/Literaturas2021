import { TestBed } from '@angular/core/testing';

import { BienvenidaService } from './bienvenida.service';

describe('BienvenidaService', () => {
  let service: BienvenidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BienvenidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
