import { TestBed } from '@angular/core/testing';

import { VacationRentalService } from './vacation-rental.service';

describe('VacationRentalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VacationRentalService = TestBed.get(VacationRentalService);
    expect(service).toBeTruthy();
  });
});
