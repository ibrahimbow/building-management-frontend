import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpShare } from './help-share';

describe('HelpShare', () => {
  let component: HelpShare;
  let fixture: ComponentFixture<HelpShare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpShare],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpShare);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
