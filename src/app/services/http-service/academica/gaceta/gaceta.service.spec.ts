import { TestBed } from '@angular/core/testing';

import { GacetaService } from './gaceta.service';

describe('GacetaService', () => {
  let service: GacetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GacetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
