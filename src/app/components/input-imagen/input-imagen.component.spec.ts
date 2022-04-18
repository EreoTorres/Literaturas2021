import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputImagenComponent } from './input-imagen.component';

describe('InputImagenComponent', () => {
  let component: InputImagenComponent;
  let fixture: ComponentFixture<InputImagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputImagenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
