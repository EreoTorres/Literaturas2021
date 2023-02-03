import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromedioMateriasComponent } from './promedio-materias.component';

describe('PromedioMateriasComponent', () => {
  let component: PromedioMateriasComponent;
  let fixture: ComponentFixture<PromedioMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromedioMateriasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromedioMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
