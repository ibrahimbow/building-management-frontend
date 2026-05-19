import { TestBed } from '@angular/core/testing';

import { TenantBuildingStateService } from './tenant-building-state.service';

describe('TenantBuildingState', () => {
  let service: TenantBuildingStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantBuildingStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
