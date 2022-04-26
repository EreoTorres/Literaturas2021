import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GacetaComponent } from './gaceta.component';

describe('GacetaComponent', () => {
  let component: GacetaComponent;
  let fixture: ComponentFixture<GacetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GacetaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GacetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
