import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@gmrc/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  errMsg: string = null;
  mylyn: string = null;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  onSubmit() {
    this.authService.login(this.form.value.email, this.form.value.password)
    .then((result) => {
      this.router.navigate(['/inquiry']);
    })
    .catch(errMsg => {
       this.errMsg = errMsg;
    });
  }
}
