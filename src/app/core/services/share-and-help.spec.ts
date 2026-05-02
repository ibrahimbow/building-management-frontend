import { TestBed } from '@angular/core/testing';

import { ShareAndHelp } from './share-and-help.service';

describe('ShareAndHelp', () => {
  let service: ShareAndHelp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareAndHelp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
