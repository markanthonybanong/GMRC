import { Tenant } from './Tenant';
export class Penalty {
  roomNumber: number;
  date: Date;
  tenant: Tenant;
  tenantObjectId: string;
  violation: string;
  fine: number;
  _id: string;
}
