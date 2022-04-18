import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmatTablePickerDatetimeComponent } from './smat-table-picker-datetime.component';

describe('SmatTablePickerDatetimeComponent', () => {
  let component: SmatTablePickerDatetimeComponent;
  let fixture: ComponentFixture<SmatTablePickerDatetimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmatTablePickerDatetimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmatTablePickerDatetimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
