import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const isTokenValid = true;
    // TODO: create auth service to check for token validity
    if (isTokenValid) {
      this.router.navigateByUrl('/inquiry');
    } else {
      // TODO: navigate to login page
    }
  }

}
