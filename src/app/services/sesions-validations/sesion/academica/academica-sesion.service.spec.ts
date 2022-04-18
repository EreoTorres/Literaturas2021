import { TestBed } from '@angular/core/testing';

import { AcademicaSesionService } from './academica-sesion.service';

describe('AcademicaSesionService', () => {
  let service: AcademicaSesionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicaSesionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
