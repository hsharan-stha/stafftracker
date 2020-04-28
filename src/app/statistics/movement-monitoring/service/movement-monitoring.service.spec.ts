import { TestBed } from '@angular/core/testing';

import { MovementMonitoringService } from './movement-monitoring.service';

describe('MovementMonitoringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MovementMonitoringService = TestBed.get(MovementMonitoringService);
    expect(service).toBeTruthy();
  });
});
