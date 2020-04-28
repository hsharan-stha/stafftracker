import { TestBed } from '@angular/core/testing';

import { GeozoneVisitsService } from './geozone-visits.service';

describe('GeozoneVisitsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeozoneVisitsService = TestBed.get(GeozoneVisitsService);
    expect(service).toBeTruthy();
  });
});
