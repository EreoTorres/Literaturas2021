import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiteraturasComponent } from './literaturas.component';

describe('LiteraturasComponent', () => {
  let component: LiteraturasComponent;
  let fixture: ComponentFixture<LiteraturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiteraturasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiteraturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
