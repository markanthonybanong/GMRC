import { Away } from './Away';
import { Tenant } from './Tenant';
export class Deck {
  number?: number;
  status?: string;
  dueRentDate?: number;
  tenant?: Tenant;
  away?: Away[];
  _id?: string;
  riceCookerBill: number;
  tenantObjectId?: string;
  oldTenantObjectId?: string;
  monthlyRent?: number;
}
