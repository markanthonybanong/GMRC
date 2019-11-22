import { RoomTenant } from './RoomTenant';
import { MonthRoomPayment } from './MonthRoomPayment';

export class RoomPaymentForPrint {
  roomNumber: number;
  tenants: Array<RoomTenant>;
  dueDates: Array<RoomTenant>;
  monthMinusThree?: MonthRoomPayment;
  monthMinusTwo?: MonthRoomPayment;
  monthMinusOne?: MonthRoomPayment;
  currentMonth?: MonthRoomPayment;
}
