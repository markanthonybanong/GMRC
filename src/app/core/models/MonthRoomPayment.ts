
export class MonthRoomPayment {
  advanceRental: Array<{
    value: number,
    name: string,
    rentStatus: {
      value: string,
      balance?: number
    }
  }>;
  electricBill: {
    value: number,
    status: string,
    balance?: number,
  };
  waterBill: {
    value: number,
    status: string,
    balance?: number,
  };
  riceCookerBill: {
    value: number,
    status: string,
    balance?: number,
  };
}
