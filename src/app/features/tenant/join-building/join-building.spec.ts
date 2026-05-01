import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinBuilding } from './join-building';

describe('JoinBuilding', () => {
  let component: JoinBuilding;
  let fixture: ComponentFixture<JoinBuilding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinBuilding],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinBuilding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
