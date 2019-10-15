import { Injectable } from '@angular/core';
import { Gender, TypeOfNetwork } from '@gmrc/enums';


@Injectable({
  providedIn: 'root'
})
export class TenantEnumService {

  constructor() { }

  get genders() {
    return Object.entries(Gender).map( element => element[1]);
  }

  get typeOfNetworks() {
    return Object.entries(TypeOfNetwork).map( element => element[1] );
  }
}
