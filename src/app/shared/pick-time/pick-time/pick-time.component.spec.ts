import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickTimeComponent } from './pick-time.component';

describe('PickTimeComponent', () => {
  let component: PickTimeComponent;
  let fixture: ComponentFixture<PickTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
