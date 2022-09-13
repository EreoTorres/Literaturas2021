import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputprogramasCeComponent } from './inputprogramas-ce.component';

describe('InputprogramasCeComponent', () => {
  let component: InputprogramasCeComponent;
  let fixture: ComponentFixture<InputprogramasCeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputprogramasCeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputprogramasCeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
