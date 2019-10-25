import { Tenant } from './Tenant';

export class Entry {
  roomNumber: number;
  tenant: Array<{}>;
  monthyRent: number;
  key: string;
  dateEntry: Date;
  dateExit: Date;
  oneMonthDeposit: string;
  oneMonthDepositBalance: Array<{}>;
  oneMonthAdvance: string;
  oneMonthAdvanceBalance: Array<{}>;
  tenantObjectId: string;
}
