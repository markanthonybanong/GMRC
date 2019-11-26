import { Tenant } from './Tenant';

export class UnsettleBill {
  roomNumber: number;
  roomType: number;
  tenants: Array<Tenant>;
  tenantsObjectId: Array<string>;
  dueDate: number;
  dateExit: Date;
  rentBalance: number;
  electricBillBalance: number;
  waterBillBalance: number;
  riceCookerBillBalance: number;
  _id: string;
}
