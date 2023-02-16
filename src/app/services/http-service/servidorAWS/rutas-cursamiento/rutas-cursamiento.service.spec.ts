import { TestBed } from '@angular/core/testing';

import { RutasCursamientoService } from './rutas-cursamiento.service';

describe('RutasCursamientoService', () => {
  let service: RutasCursamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RutasCursamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
