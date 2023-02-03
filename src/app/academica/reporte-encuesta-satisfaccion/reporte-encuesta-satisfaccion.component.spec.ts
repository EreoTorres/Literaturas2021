import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEncuestaSatisfaccionComponent } from './reporte-encuesta-satisfaccion.component';

describe('ReporteEncuestaSatisfaccionComponent', () => {
  let component: ReporteEncuestaSatisfaccionComponent;
  let fixture: ComponentFixture<ReporteEncuestaSatisfaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteEncuestaSatisfaccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteEncuestaSatisfaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
