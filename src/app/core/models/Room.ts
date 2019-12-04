import { Bedspace } from './Bedspace';
import { Tenant } from './Tenant';

export class Room {
  number: number;
  floor: number;
  type: string;
  aircon: string;
  transientPrivateRoomProperties: [{
    status: string,
    dueRentDate: number,
    monthlyRent: number,
    riceCookerBill: number,
    tenants: Array<Tenant>;
  }];
  bedspaces: Bedspace[];
  tenantsArr: Tenant[];
  _id: string;
}
