import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  routeToEntry(): void {
    this.router.navigate(['payment/entry']);
  }
  routeToRoom(): void {
    this.router.navigate(['payment/room']);
  }
  routeToPenalties(): void {
    this.router.navigate(['payment/penalties']);
  }
}
