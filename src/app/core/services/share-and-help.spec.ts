import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ShareAndHelpService } from './share-and-help.service';

describe('ShareAndHelpService', () => {
  let service: ShareAndHelpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(ShareAndHelpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});