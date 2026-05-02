import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAndHelp } from './share-and-help';

describe('ShareAndHelp', () => {
  let component: ShareAndHelp;
  let fixture: ComponentFixture<ShareAndHelp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareAndHelp],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareAndHelp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
