import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputprogramasAllComponent } from './inputprogramas-all.component';

describe('InputprogramasAllComponent', () => {
  let component: InputprogramasAllComponent;
  let fixture: ComponentFixture<InputprogramasAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputprogramasAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputprogramasAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
