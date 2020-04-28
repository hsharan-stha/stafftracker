import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PunctualEmployeeComponent } from './punctual-employee.component';

describe('PunctualEmployeeComponent', () => {
  let component: PunctualEmployeeComponent;
  let fixture: ComponentFixture<PunctualEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PunctualEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PunctualEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
