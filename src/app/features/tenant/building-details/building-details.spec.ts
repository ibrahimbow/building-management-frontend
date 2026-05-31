import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingDetails } from './building-details';
import { Building } from '../../../core/models/building.model';

describe('BuildingDetails', () => {
  let component: BuildingDetails;
  let fixture: ComponentFixture<BuildingDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingDetails );
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
