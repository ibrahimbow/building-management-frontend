import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyDialog } from './privacy-policy-dialog';

describe('PrivacyPolicyDialog', () => {
  let component: PrivacyPolicyDialog;
  let fixture: ComponentFixture<PrivacyPolicyDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
