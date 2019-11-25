export class RoomTenant {
  name: string;
  dueRentDate: number;
  rent: number;
  rentStatus: {value: string, balance?: number};
  index?: number;
}
