import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolatingEmployeeComponent } from './violating-employee.component';

describe('ViolatingEmployeeComponent', () => {
  let component: ViolatingEmployeeComponent;
  let fixture: ComponentFixture<ViolatingEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolatingEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolatingEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
