export interface IBase {
  id: number;
  status: number;
  createdById?: number;
  updatedById?: number;
  tenantId?: number;
  createdAt?: string;
  updatedAt?: string;
}
