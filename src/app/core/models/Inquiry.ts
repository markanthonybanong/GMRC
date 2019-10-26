export class Inquiry {
  name: string;
  roomNumber: string;
  roomType: string;
  bedInfos: Array<{bedNumber: number, deckNumber: number}>;
  willOccupyIn: Date;
  phoneNumber: number;
  gender: string;
  howDidYouFindUs: string;
  status: string;
  _id: string;
}
