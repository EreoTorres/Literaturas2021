import { TestBed } from '@angular/core/testing';

import { CereporteService } from './cereporte.service';

describe('CereporteService', () => {
  let service: CereporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CereporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
