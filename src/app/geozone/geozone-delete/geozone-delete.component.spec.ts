import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeozoneDeleteComponent } from './geozone-delete.component';

describe('GeozoneDeleteComponent', () => {
  let component: GeozoneDeleteComponent;
  let fixture: ComponentFixture<GeozoneDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeozoneDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeozoneDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
