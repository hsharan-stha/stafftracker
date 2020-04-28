import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeozoneListComponent } from './geozone-list.component';

describe('GeozoneListComponent', () => {
  let component: GeozoneListComponent;
  let fixture: ComponentFixture<GeozoneListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeozoneListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeozoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
