export class RoomTenant {
 names: Array<string>;
 dueRentDates: Array<number>;
 rents: Array<number>;
 indexes: Array<number>;
 rentStatuses?: Array<{value: string, balance?: number}>;
}
