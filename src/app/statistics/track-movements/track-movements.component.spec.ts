import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackMovementsComponent } from './track-movements.component';

describe('TrackMovementsComponent', () => {
  let component: TrackMovementsComponent;
  let fixture: ComponentFixture<TrackMovementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackMovementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
