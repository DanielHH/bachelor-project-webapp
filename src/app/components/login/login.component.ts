import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { User } from '../../datamodels/user';
import { FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  error = '';
  user: User;

  username = '';
  password = '';

  usernameControl = new FormControl('', Validators.required);
  passwordControl = new FormControl('', Validators.required);

  @ViewChild('loginForm') loginForm: NgForm;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {}

  login(val: any) {
    if (this.isValidInput()) {
      this.loading = true;
      this.authService.login(this.username, this.password);
    }
  }

  /**
   * Returns true if entered username is valid, else false.
   */
  isValidUsername() {
    return !this.usernameControl.hasError('required');
  }

  /**
   * Returns true if entered password is valid, else false.
   */
  isValidPassword() {
    return !this.passwordControl.hasError('required');
  }

  isValidInput() {
    return this.isValidUsername() && this.isValidPassword();
  }
}
