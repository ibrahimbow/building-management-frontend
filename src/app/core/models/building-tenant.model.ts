export interface BuildingTenant {
  tenantUserId: number;
  tenantUsername: string;
  tenantEmail: string;
  tenantPhoneNumber: string | null;
  joinedAt: string;
}