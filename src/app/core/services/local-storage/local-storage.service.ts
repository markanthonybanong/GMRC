import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private prependKey = 'GMRC:';

  constructor() { }

  clear() {
    const keys = Object.keys(window.localStorage).filter(key => key.includes(this.prependKey));

    keys.forEach(key => {
      window.localStorage.removeItem(key);
    });
  }

  remove(key: string) {
    key = `${this.prependKey}${key}`;
    window.localStorage.removeItem(key);
  }

  setItem(key: string, value: any) {
    key = `${this.prependKey}${key}`;

    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    window.localStorage.setItem(key, value);
  }

  getItem(key: string): any {
    key = `${this.prependKey}${key}`;

    let value = window.localStorage.getItem(key);

    try {
      value = JSON.parse(value);
    } catch (e) {
      value = value;
    }

    return value;
  }



}
