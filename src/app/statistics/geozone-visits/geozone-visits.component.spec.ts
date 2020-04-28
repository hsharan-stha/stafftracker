import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeozoneVisitsComponent } from './geozone-visits.component';

describe('GeozoneVisitsComponent', () => {
  let component: GeozoneVisitsComponent;
  let fixture: ComponentFixture<GeozoneVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeozoneVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeozoneVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
