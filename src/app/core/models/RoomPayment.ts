import { RoomTenant } from './RoomTenant';
export class RoomPayment {
  amountKWUsed: number;
  date: string;
  dateInDateFormat: Date;
  electricBillBalance: Array<{balance: number}>;
  electricBillStatus: string;
  presentReading: Date;
  presentReadingKWUsed: number;
  previousReading: Date;
  previousReadingKWUsed: number;
  riceCookerBillBalance:  Array<{balance: number}>;
  riceCookerBillStatus: string;
  roomNumber: number;
  waterBillBalance: Array<{balance: number}>;
  waterBillStatus: string;
  roomTenants: Array<RoomTenant>;
  _id: string;
 }
