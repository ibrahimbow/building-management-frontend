import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoNotice } from './demo-notice';

describe('DemoNotice', () => {
  let component: DemoNotice;
  let fixture: ComponentFixture<DemoNotice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoNotice],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoNotice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
