import { TestBed } from '@angular/core/testing';

import { RelacionMateriasService } from './relacion-materias.service';

describe('RelacionMateriasService', () => {
  let service: RelacionMateriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelacionMateriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
