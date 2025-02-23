import { TestBed } from '@angular/core/testing';

import { MyReservationServiceService } from './my-reservation-service.service';

describe('MyReservationServiceService', () => {
  let service: MyReservationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyReservationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
