import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutasCursamientoComponent } from './rutas-cursamiento.component';

describe('RutasCursamientoComponent', () => {
  let component: RutasCursamientoComponent;
  let fixture: ComponentFixture<RutasCursamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutasCursamientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RutasCursamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
