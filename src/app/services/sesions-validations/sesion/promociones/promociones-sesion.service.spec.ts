import { TestBed } from '@angular/core/testing';

import { PromocionesSesionService } from './promociones-sesion.service';

describe('PromocionesSesionService', () => {
  let service: PromocionesSesionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromocionesSesionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
