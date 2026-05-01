import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentChat } from './resident-chat';

describe('ResidentChat', () => {
  let component: ResidentChat;
  let fixture: ComponentFixture<ResidentChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentChat],
    }).compileComponents();

    fixture = TestBed.createComponent(ResidentChat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
