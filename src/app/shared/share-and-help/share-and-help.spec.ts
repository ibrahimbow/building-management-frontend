import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAndHelpComponent } from './share-and-help';

describe('ShareAndHelpComponent', () => {
  let component: ShareAndHelpComponent;
  let fixture: ComponentFixture<ShareAndHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareAndHelpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareAndHelpComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
