import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingChat } from './building-chat';

describe('TenantChat', () => {
  let component: BuildingChat;
  let fixture: ComponentFixture<BuildingChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingChat],
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingChat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
