import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartTableDatepickerComponentTime } from './smart-table-datepicker-time.component';

describe('SmartTableDatepickerComponentTime', () => {
  let component: SmartTableDatepickerComponentTime;
  let fixture: ComponentFixture<SmartTableDatepickerComponentTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartTableDatepickerComponentTime ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartTableDatepickerComponentTime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
