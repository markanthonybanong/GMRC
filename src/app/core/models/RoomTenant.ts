export class RoomTenant {
 names: Array<string>;
 dueRentDates: Array<number>;
 rents: Array<number>;
 indexes: Array<number>;
 statuses?: Array<{value: string, balance?: number}>;
 electricBillStatus?: string;
 waterBillStatus?: string;
 riceCookerBillStatus?: string;

}
