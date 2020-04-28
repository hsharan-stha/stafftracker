import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatePointComponent } from './coordinate-point.component';

describe('CoordinatePointComponent', () => {
  let component: CoordinatePointComponent;
  let fixture: ComponentFixture<CoordinatePointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoordinatePointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinatePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
