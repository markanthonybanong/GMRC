import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@gmrc/services';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkTokenValidity()
    .then(isValid => {
      this.router.navigateByUrl('/inquiry');
    }).catch(err => {
      this.router.navigateByUrl('/login');
    });
  }

}
