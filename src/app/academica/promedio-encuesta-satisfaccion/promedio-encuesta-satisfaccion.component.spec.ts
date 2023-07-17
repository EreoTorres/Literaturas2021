import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromedioEncuestaSatisfaccionComponent } from './promedio-encuesta-satisfaccion.component';

describe('PromedioEncuestaSatisfaccionComponent', () => {
  let component: PromedioEncuestaSatisfaccionComponent;
  let fixture: ComponentFixture<PromedioEncuestaSatisfaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromedioEncuestaSatisfaccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromedioEncuestaSatisfaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
