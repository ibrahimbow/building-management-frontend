export interface CreateBuildingRequest {
  buildingName: string;
  address: string;
  totalApartments: number;
  emergencyPhone: string;
}

export interface BuildingInfo {
  id: string;
  buildingName: string;
  code: string;
  address: string;
  managerName: string;
  managerEmail: string;
  totalApartments: number;
  emergencyPhone: string;
}

export interface UpdateBuildingRequest {
  buildingName: string;
  address: string;
  totalApartments: number;
  emergencyPhone: string;
}