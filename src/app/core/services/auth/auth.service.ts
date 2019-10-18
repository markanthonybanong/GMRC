import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private localStorageService: LocalStorageService
  ) { }
  async checkTokenValidity() {
    const tokenExp = this.localStorageService.getItem('tokenExp');
    if (tokenExp !== null) {
      if (tokenExp > new Date().getTime() / 1000 ) {
         this.apiService.get('auth/validate-token').then( isValid => {
            if ( isValid ) {
              return true;
            } else {
              this.localStorageService.remove('token');
              this.localStorageService.remove('tokenExp');
              return false;
            }
         });
       } else {
         return false;
       }
   } else {
    return Promise.reject('Invalid token.');
   }
  }
  async login(email: string, password: string) {
    return this.apiService
      .post<any>('auth', {
        email: email,
        password: password
      })
      .then(res => {
        this.localStorageService.setItem('token', res.token);
        this.localStorageService.setItem('tokenExp', res.tokenExp);
        this.apiService.initHttpOptionsHeader();
      })
      .catch(err => {
        return Promise.reject('Invalid email or password. Try again.');
      });
  }
  logout(): void {
    this.localStorageService.remove('token');
    this.localStorageService.remove('tokenExp');
  }
}
