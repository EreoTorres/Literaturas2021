import { TestBed } from '@angular/core/testing';

import { ConsejeriaEstudiantilService } from './consejeria-estudiantil.service';

describe('ConsejeriaEstudiantilService', () => {
  let service: ConsejeriaEstudiantilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsejeriaEstudiantilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
