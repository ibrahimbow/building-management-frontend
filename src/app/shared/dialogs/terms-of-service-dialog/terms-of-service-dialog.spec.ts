import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfServiceDialog } from './terms-of-service-dialog';

describe('TermsOfServiceDialog', () => {
  let component: TermsOfServiceDialog;
  let fixture: ComponentFixture<TermsOfServiceDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsOfServiceDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsOfServiceDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
