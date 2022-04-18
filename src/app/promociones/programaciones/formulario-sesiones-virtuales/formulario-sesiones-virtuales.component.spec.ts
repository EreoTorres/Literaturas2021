import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioSesionesVirtualesComponent } from './formulario-sesiones-virtuales.component';

describe('FormularioSesionesVirtualesComponent', () => {
  let component: FormularioSesionesVirtualesComponent;
  let fixture: ComponentFixture<FormularioSesionesVirtualesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioSesionesVirtualesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioSesionesVirtualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
