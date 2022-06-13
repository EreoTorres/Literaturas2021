import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecaVirtualComponent } from './biblioteca-virtual.component';

describe('BibliotecaVirtualComponent', () => {
  let component: BibliotecaVirtualComponent;
  let fixture: ComponentFixture<BibliotecaVirtualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BibliotecaVirtualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliotecaVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
