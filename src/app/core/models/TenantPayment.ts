export class TenantPayment {
  name: string;
  dueDate: number;
  rent: number;
  status: string;
  rentBalance: Array<{balance: number}>;
 }
