import { Tenant } from './Tenant';

export class Entry {
  roomNumber: number;
  tenant: Array<Tenant>;
  monthlyRent: number;
  key: string;
  dateEntry: Date;
  dateExit: Date;
  oneMonthDeposit: string;
  oneMonthDepositBalance: Array<{balance: number}>;
  oneMonthAdvance: string;
  oneMonthAdvanceBalance: Array<{balance: number}>;
  _id: string;
}
