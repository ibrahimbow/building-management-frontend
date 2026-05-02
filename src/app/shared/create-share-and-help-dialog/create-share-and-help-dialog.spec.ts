import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShareAndHelpDialog } from './create-share-and-help-dialog';

describe('CreateShareAndHelpDialog', () => {
  let component: CreateShareAndHelpDialog;
  let fixture: ComponentFixture<CreateShareAndHelpDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateShareAndHelpDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateShareAndHelpDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
