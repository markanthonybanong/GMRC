import { Tenant } from './Tenant';

export class Entry {
  tenant: Tenant;
  roomType: string;
  monthyRent: number;
  key: string;
  oneMonthDeposit: string;
  oneMonthDepositBalance: Array<{}>;
  oneMonthAdvance: string;
  oneMonthAdvanceBalance: Array<{}>;
  tenantObjectId: string;
}
