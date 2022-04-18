import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstatusSelectComponent } from './estatus-select.component';

describe('EstatusSelectComponent', () => {
  let component: EstatusSelectComponent;
  let fixture: ComponentFixture<EstatusSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstatusSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstatusSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
