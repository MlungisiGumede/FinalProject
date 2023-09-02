import { TestBed } from '@angular/core/testing';

import { AiImageServiceService } from './ai-image-service.service';

describe('AiImageServiceService', () => {
  let service: AiImageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiImageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
