import { TestBed } from '@angular/core/testing';

import { SharedStyleServiceService } from './shared-style-service.service';

describe('SharedStyleServiceService', () => {
  let service: SharedStyleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedStyleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
