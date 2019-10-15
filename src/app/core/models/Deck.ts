import { Away } from './Away';
import { Tenant } from './Tenant';
export class Deck {
  number: number;
  status: string;
  dueRent: string;
  tenant: Tenant;
  away: Away[];
  _id: string;
  tenantObjectId: string;
}
