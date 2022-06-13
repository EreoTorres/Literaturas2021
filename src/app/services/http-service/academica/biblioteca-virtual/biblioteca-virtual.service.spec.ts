import { TestBed } from '@angular/core/testing';

import { BibliotecaVirtualService } from './biblioteca-virtual.service';

describe('BibliotecaVirtualService', () => {
  let service: BibliotecaVirtualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BibliotecaVirtualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
