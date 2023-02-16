import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServidorAWSComponent } from './servidorAWS.component';

describe('ServidorAWSComponent', () => {
  let component: ServidorAWSComponent;
  let fixture: ComponentFixture<ServidorAWSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServidorAWSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServidorAWSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
