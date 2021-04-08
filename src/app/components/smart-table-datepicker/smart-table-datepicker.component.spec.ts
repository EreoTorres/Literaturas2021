import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartTableDatepickerComponent } from './smart-table-datepicker.component';

describe('SmartTableDatepickerComponent', () => {
  let component: SmartTableDatepickerComponent;
  let fixture: ComponentFixture<SmartTableDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartTableDatepickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartTableDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
