import { TestBed } from '@angular/core/testing';

import { AccountSetupService } from './account-setup.service';

describe('AccountSetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountSetupService = TestBed.get(AccountSetupService);
    expect(service).toBeTruthy();
  });
});
