import { TestBed } from '@angular/core/testing';

import { ValidTipoTextService } from './valid-tipo-text.service';

describe('ValidTipoTextService', () => {
  let service: ValidTipoTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidTipoTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
