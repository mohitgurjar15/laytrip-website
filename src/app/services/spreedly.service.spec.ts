import { TestBed } from '@angular/core/testing';

import { SpreedlyService } from './spreedly.service';

describe('SpreedlyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpreedlyService = TestBed.get(SpreedlyService);
    expect(service).toBeTruthy();
  });
});
