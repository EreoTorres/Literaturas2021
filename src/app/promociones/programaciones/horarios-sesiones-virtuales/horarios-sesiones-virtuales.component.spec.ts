import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosSesionesVirtualesComponent } from './horarios-sesiones-virtuales.component';

describe('HorariosSesionesVirtualesComponent', () => {
  let component: HorariosSesionesVirtualesComponent;
  let fixture: ComponentFixture<HorariosSesionesVirtualesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorariosSesionesVirtualesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorariosSesionesVirtualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
