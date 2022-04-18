import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputprogramasComponent } from './inputprogramas.component';

describe('InputprogramasComponent', () => {
  let component: InputprogramasComponent;
  let fixture: ComponentFixture<InputprogramasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputprogramasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputprogramasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
