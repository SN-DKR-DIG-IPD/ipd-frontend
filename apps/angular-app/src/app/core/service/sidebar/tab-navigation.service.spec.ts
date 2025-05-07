import { TestBed } from '@angular/core/testing';

import { TabNavigationService } from './tab-navigation.service';

describe('TabNavigationService', () => {
  let service: TabNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
