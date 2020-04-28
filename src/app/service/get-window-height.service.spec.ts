import { TestBed } from '@angular/core/testing';

import { GetWindowHeightService } from './get-window-height.service';

describe('GetWindowHeightService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetWindowHeightService = TestBed.get(GetWindowHeightService);
    expect(service).toBeTruthy();
  });
});
