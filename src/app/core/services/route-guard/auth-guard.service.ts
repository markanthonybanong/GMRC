import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      this.authService
        .checkTokenValidity()
        .then(isValid => {
          if (isValid) {
            resolve(true);
          } else {
            this.router.navigateByUrl('/login');
            resolve(false);
          }
        })
        .catch(err => {
          this.router.navigateByUrl('/login');
          resolve(false);
        });
    });
  }
}
