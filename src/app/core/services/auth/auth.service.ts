import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Token } from '@gmrc/models';
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
        const isValid = await this.apiService.get('auth/validate-token');
        if (isValid) {
          return true;
        } else {
          this.localStorageService.clear();
          return false;
        }
       } else {
         this.localStorageService.clear();
         return false;
       }
   } else {
    return Promise.reject('Invalid token.');
   }
  }
  async login(email: string, password: string) {
    try {
      const response = await this.apiService.post<Token>('auth', {email: email, password: password });
      this.localStorageService.setItem('token', response.token);
      this.localStorageService.setItem('tokenExp', response.tokenExp);
      this.apiService.initHttpOptionsHeader();
    } catch (error) {
      return Promise.reject('Invalid email or password. Try again.');
    }
  }
  logout(): void {
    this.localStorageService.remove('token');
    this.localStorageService.remove('tokenExp');
  }
}
