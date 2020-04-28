import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbEmpActionComponent } from './db-emp-action.component';

describe('DbEmpActionComponent', () => {
  let component: DbEmpActionComponent;
  let fixture: ComponentFixture<DbEmpActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbEmpActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbEmpActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
