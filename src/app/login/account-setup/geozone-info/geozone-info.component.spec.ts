import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeozoneInfoComponent } from './geozone-info.component';

describe('GeozoneInfoComponent', () => {
  let component: GeozoneInfoComponent;
  let fixture: ComponentFixture<GeozoneInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeozoneInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeozoneInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
