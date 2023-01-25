import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CereporteComponent } from './cereporte.component';

describe('CereporteComponent', () => {
  let component: CereporteComponent;
  let fixture: ComponentFixture<CereporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CereporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CereporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
