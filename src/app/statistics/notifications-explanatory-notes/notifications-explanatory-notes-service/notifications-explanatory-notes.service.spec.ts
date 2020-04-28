import { TestBed } from '@angular/core/testing';

import { NotificationsExplanatoryNotesService } from './notifications-explanatory-notes.service';

describe('NotificationsExplanatoryNotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationsExplanatoryNotesService = TestBed.get(NotificationsExplanatoryNotesService);
    expect(service).toBeTruthy();
  });
});
