import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesLiteraturasComponent } from './opciones-literaturas.component';

describe('OpcionesLiteraturasComponent', () => {
  let component: OpcionesLiteraturasComponent;
  let fixture: ComponentFixture<OpcionesLiteraturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpcionesLiteraturasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcionesLiteraturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
