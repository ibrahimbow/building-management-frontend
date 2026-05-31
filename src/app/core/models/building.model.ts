export interface CreateBuildingRequest {
  buildingName: string;
  address: string;
  totalApartments: number;
  emergencyPhone: string;
}

export interface Building {
  id: string;
  buildingName: string;
  code: string;
  address: string;
  managerId: number;
  managerName: string;
  totalApartments: number;
  emergencyPhone: string;
}

export interface UpdateBuildingRequest {
  buildingName: string;
  address: string;
  totalApartments: number;
  emergencyPhone: string;
}