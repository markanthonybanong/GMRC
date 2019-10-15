import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  constructor() { }
  removeNullValuesInSearchResult(searchResult: object): object {
    const filteredSearchResult = {};
    Object.entries(searchResult).forEach( element => {
      if (element[1] !== null) {
        filteredSearchResult[element[0]] = element[1];
      }
    });
    return filteredSearchResult;
  }

}
