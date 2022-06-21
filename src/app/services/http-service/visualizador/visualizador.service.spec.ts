import { TestBed } from '@angular/core/testing';

import { VisualizadorService } from './visualizador.service';

describe('VisualizadorService', () => {
  let service: VisualizadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisualizadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
