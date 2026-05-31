import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBuilding } from './update-building';

describe('UpdateBuilding', () => {
  let component: UpdateBuilding;
  let fixture: ComponentFixture<UpdateBuilding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateBuilding],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateBuilding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
