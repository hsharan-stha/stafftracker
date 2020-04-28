import { TestBed } from '@angular/core/testing';

import { PunctualEmployeeService } from './punctual-employee.service';

describe('PunctualEmployeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PunctualEmployeeService = TestBed.get(PunctualEmployeeService);
    expect(service).toBeTruthy();
  });
});
