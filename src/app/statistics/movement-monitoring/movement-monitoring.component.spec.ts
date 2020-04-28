import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementMonitoringComponent } from './movement-monitoring.component';

describe('MovementMonitoringComponent', () => {
  let component: MovementMonitoringComponent;
  let fixture: ComponentFixture<MovementMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovementMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
