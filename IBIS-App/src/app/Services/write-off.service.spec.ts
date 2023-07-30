import { TestBed } from '@angular/core/testing';

import { WriteOffService } from './write-off.service';

describe('WriteOffService', () => {
  let service: WriteOffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WriteOffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
