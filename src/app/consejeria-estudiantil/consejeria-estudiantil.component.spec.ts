import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsejeriaEstudiantilComponent } from './consejeria-estudiantil.component';

describe('ConsejeriaEstudiantilComponent', () => {
  let component: ConsejeriaEstudiantilComponent;
  let fixture: ComponentFixture<ConsejeriaEstudiantilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsejeriaEstudiantilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsejeriaEstudiantilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
