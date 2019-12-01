export class RoomTenant {
  name: string;
  dueRentDate: number;
  rent: number;
  rentToPay?: number;
  rentInterestAdded?: string;
  rentStatus: {
    value: string,
    balance?: number,
  };
  riceCookerBill?: number;
  riceCookerBillToPay?: number;
  riceCookerBillInterestAdded?: string;
  riceCookerBillStatus?: {
    value: string,
    balance?: number,
  };

  index?: number;
}
