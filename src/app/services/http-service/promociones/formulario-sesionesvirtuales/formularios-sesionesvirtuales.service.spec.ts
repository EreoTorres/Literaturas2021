import { TestBed } from '@angular/core/testing';

import { FormulariosSesionesvirtualesService } from './formularios-sesionesvirtuales.service';

describe('FormulariosSesionesvirtualesService', () => {
  let service: FormulariosSesionesvirtualesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormulariosSesionesvirtualesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
