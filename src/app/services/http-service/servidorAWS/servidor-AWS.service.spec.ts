import { TestBed } from '@angular/core/testing';

import { ServidorAWSService } from './servidor-AWS.service';

describe('ServidorAWSService', () => {
  let service: ServidorAWSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServidorAWSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
