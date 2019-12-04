
export class MonthRoomPayment {
  advanceRental: Array<{
    value: number,
    name: string,
    interestAdded: string,
    rentStatus: {
      value: string,
      balance?: number
    }
  }>;
  riceCookerBill: Array<{
    value: number,
    interestAdded: string,
    status: string,
    balance?: number,
  }>;
  electricBill: {
    value: number,
    interestAdded: string,
    status: string,
    balance?: number,
  };
  waterBill: {
    value: number,
    interestAdded: string,
    status: string,
    balance?: number,
  };

}
