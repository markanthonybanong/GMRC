import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '@gmrc/shared';
import { AuthService } from '@gmrc/services';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

 constructor(
   private router: Router,
   private dialog: MatDialog,
   private authService: AuthService
   ) { }

 ngOnInit() {

 }
 navigateToLogInForm(): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    data: {
      title: 'Confirm Log out',
      content: 'Are you sure you want to log out?'
    }
  });
  dialogRef.afterClosed().subscribe( isLogOut => {
    if (isLogOut) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  });

 }
}
