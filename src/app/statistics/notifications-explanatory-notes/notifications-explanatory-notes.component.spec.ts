import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsExplanatoryNotesComponent } from './notifications-explanatory-notes.component';

describe('NotificationsExplanatoryNotesComponent', () => {
  let component: NotificationsExplanatoryNotesComponent;
  let fixture: ComponentFixture<NotificationsExplanatoryNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsExplanatoryNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsExplanatoryNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
