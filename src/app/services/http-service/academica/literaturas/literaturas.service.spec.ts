import { TestBed } from '@angular/core/testing';

import { LiteraturasService } from './literaturas.service';

describe('LiteraturasService', () => {
  let service: LiteraturasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiteraturasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
