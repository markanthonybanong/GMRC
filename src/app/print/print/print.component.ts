import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  openRoomBillsTab(): void {
    window.open('print/room-bills', '_blank');
  }
  openElectricBillsTab(): void {
    window.open('print/electric-bills', '_blank');
  }
  routeToUnpaidBalanceTenants(): void {
    this.router.navigate(['print/unpaid-balance-tenants']);
  }
  routeToPromisoryNote(): void {
    this.router.navigate(['/print/promisory-note']);
  }
}
