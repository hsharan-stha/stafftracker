import { TestBed } from '@angular/core/testing';

import { GeozoneService } from './geozone.service';

describe('GeozoneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeozoneService = TestBed.get(GeozoneService);
    expect(service).toBeTruthy();
  });
});
