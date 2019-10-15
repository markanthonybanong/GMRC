import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  notifySuccess( message: string) {
    this.snackBar.open( message, null, {
      panelClass: ['snack-bar-success'],
      duration: 2000
    });
  }

  notifyFailed( message: string) {
    this.snackBar.open(message, null, {
      panelClass: ['snack-bar-failure'],
      duration: 2000
    });
  }

}
